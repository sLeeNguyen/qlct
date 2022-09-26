import chroma from 'chroma-js';
import produce from 'immer';
import { ChangeEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Plus as PlusIcon } from 'react-feather';
import ReactSelect, { MultiValue, Props as ReactSelectProps } from 'react-select';
import { toast } from 'react-toastify';
import Button, { ButtonProps } from 'src/components/Button';
import { CardBody, CardHeader } from 'src/components/card';
import { Container } from 'src/components/container';
import { Form, FormField, Input, Label, TextArea } from 'src/components/form';
import { GridContainer, GridItem } from 'src/components/grid';
import Popper from 'src/components/Popper';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { addInOut } from 'src/firebase/apis';
import useComponentDidUpdate from 'src/hooks/useComponentDidUpdate';
import { User, useUserStore } from 'src/store';
import { useManagementStore } from 'src/store/management';

type FormDataState = {
  type: 'income' | 'outcome';
  value: string;
  time: Date | null | undefined;
  content: string;
  categories: MultiValue<ReactSelectOption>;
};

type FormDataStateHelperText = {
  type?: string | null | undefined;
  value: string | null | undefined;
  time?: string | null | undefined;
  content?: string | null | undefined;
  categories?: string | null | undefined;
};

type ReactSelectOption = {
  value: string;
  label: string;
};

export default function Add(props: Partial<ButtonProps>) {
  const user = useUserStore((state) => state.user as User);
  const [categories, fetchCategories, fetchInOut] = useManagementStore((state) => [
    state.categories,
    state.fetchCategories,
    state.fetchInOut,
  ]);

  const categoriesOptions = useMemo<ReactSelectOption[]>(() => {
    if (!categories) return [];
    return categories.map((item) => ({ value: item.id as string, label: item.name }));
  }, [categories]);

  const [openPopper, setOpenPopper] = useState<boolean>(false);
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    type: 'outcome',
    value: '0',
    time: null,
    content: '',
    categories: [],
  });
  const [formDataHelperText, setFormDataHelperText] = useState<FormDataStateHelperText>({
    type: null,
    value: null,
    time: null,
    content: null,
    categories: null,
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const submitBtnDisabled = Boolean(
    formDataHelperText.categories ||
      formDataHelperText.content ||
      formDataHelperText.time ||
      formDataHelperText.value ||
      formDataHelperText.type ||
      isAdding
  );

  useEffect(() => {
    const handleClick = () => {
      setOpenPopper(false);
    };

    if (openPopper) {
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [openPopper]);

  const toggleButton = (ev: SyntheticEvent) => {
    ev.stopPropagation();
    setOpenPopper(!openPopper);
  };

  const getInputChangeHandler =
    (name: 'type' | 'value' | 'content') => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(
        produce((d) => {
          if (name === 'type') {
            d[name] = ev.target.value as 'income' | 'outcome';
          } else {
            d[name] = ev.target.value;
          }
        })
      );
    };

  const handleTimeChange = (date: Date | null) => {
    setFormData(
      produce((d) => {
        d.time = date ?? new Date();
      })
    );
  };

  const handleCategoriesChange: ReactSelectProps<ReactSelectOption, true>['onChange'] = (newValue) => {
    setFormData(
      produce((d) => {
        d.categories = [...newValue];
      })
    );
  };

  const validateForm = (formData: FormDataState) => {
    let flag = true;
    setFormDataHelperText(
      produce((d) => {
        const check = (isInvalid: boolean, field: keyof FormDataState, message: string) => {
          if (isInvalid) {
            flag = false;
            d[field] = message;
          } else {
            d[field] = null;
          }
        };
        check(!['income', 'outcome'].includes(formData.type), 'type', 'Please choose one type');
        check(!formData.value || isNaN(Number(formData.value)), 'value', 'Please enter a number');
        check(!(formData.time instanceof Date), 'time', 'Invalid date');
      })
    );
    return flag;
  };

  const handleAdd = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    if (!validateForm(formData)) return;
    try {
      setIsAdding(true);
      await addInOut({
        type: formData.type,
        content: formData.content,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        time: formData.time!.getTime(),
        categories: formData.categories.map((item) => item.value),
        uid: user.uid,
        value: Number(formData.value),
        createdAt: new Date().getTime(),
      });
      toast.success('Added successfully');
      fetchCategories(user.uid);
      fetchInOut(user.uid);
      setFormData({ type: 'outcome', value: '0', time: formData.time, content: '', categories: [] });
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
    setIsAdding(false);
  };

  useComponentDidUpdate(() => {
    validateForm(formData);
  }, [formData]);

  return (
    <>
      <Button
        ref={setButtonElement}
        size="small"
        variant="contained"
        color="primary"
        startIcon={<PlusIcon size={16} />}
        {...props}
        onClick={toggleButton}
      >
        Add
      </Button>
      <Popper
        open={openPopper}
        anchorEl={buttonElement}
        arrow
        popperOptions={{
          placement: 'bottom-end',
        }}
        onClick={(ev) => ev.stopPropagation()}
        css={{
          filter: 'drop-shadow(0px 0px 4px rgba(97, 151, 51, 0.6)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))',
        }}
      >
        <CardHeader>
          <Text color={colors.primary} css={{ fontWeight: 600, fontSize: 20, textAlign: 'center' }}>
            Add Item
          </Text>
        </CardHeader>
        <CardBody>
          <Container maxWidth={400}>
            <Form onSubmit={handleAdd} noValidate>
              <FormField row spacing={4}>
                <FormField row>
                  <Input
                    id="income"
                    type="radio"
                    name="type"
                    value="income"
                    onChange={getInputChangeHandler('type')}
                    checked={formData.type === 'income'}
                  />
                  <Label htmlFor="income">Income</Label>
                </FormField>
                <FormField row>
                  <Input
                    id="outcome"
                    type="radio"
                    name="type"
                    value="outcome"
                    onChange={getInputChangeHandler('type')}
                    checked={formData.type === 'outcome'}
                  />
                  <Label htmlFor="outcome">Outcome</Label>
                </FormField>
              </FormField>
              <GridContainer spacing={2}>
                <GridItem xs={6}>
                  <FormField>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      fullWidth
                      value={formData.value}
                      onChange={getInputChangeHandler('value')}
                      error={!!formDataHelperText.value}
                      helperText={formDataHelperText.value}
                    />
                  </FormField>
                </GridItem>
                <GridItem xs={6}>
                  <FormField>
                    <Label htmlFor="time">Time</Label>
                    <div
                      css={{
                        '& .custom-calender': {
                          width: 'max-content',
                        },
                      }}
                    >
                      <DatePicker
                        id="time"
                        name="time"
                        showTimeSelect
                        selected={undefined}
                        customInput={
                          <Input
                            css={{
                              '& + p': {
                                marginTop: 6,
                              },
                            }}
                            error={!!formDataHelperText.time}
                            helperText={formDataHelperText.time}
                          />
                        }
                        closeOnScroll={true}
                        onChange={handleTimeChange}
                        calendarClassName="custom-calender"
                        dateFormat="yyyy-MM-dd hh:mm a"
                      />
                    </div>
                  </FormField>
                </GridItem>
              </GridContainer>
              <FormField>
                <Label htmlFor="content">Content</Label>
                <TextArea
                  id="content"
                  name="content"
                  fullWidth
                  rows={3}
                  value={formData.content}
                  onChange={getInputChangeHandler('content')}
                  error={!!formDataHelperText.content}
                  helperText={formDataHelperText.content}
                />
              </FormField>
              <FormField>
                <Label htmlFor="categories">Categories</Label>
                <ReactSelect
                  isMulti
                  options={categoriesOptions}
                  onChange={handleCategoriesChange}
                  value={formData.categories}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: colors.primary,
                      primary75: chroma(colors.primary).alpha(0.75).hex(),
                      primary50: chroma(colors.primary).alpha(0.5).hex(),
                      primary25: chroma(colors.primary).alpha(0.25).hex(),
                      danger: colors.error,
                    },
                  })}
                />
              </FormField>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                css={{ marginTop: 8 }}
                disabled={submitBtnDisabled}
                loading={isAdding}
              >
                Add
              </Button>
            </Form>
          </Container>
        </CardBody>
      </Popper>
    </>
  );
}
