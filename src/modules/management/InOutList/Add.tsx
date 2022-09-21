import chroma from 'chroma-js';
import { addDoc } from 'firebase/firestore';
import produce from 'immer';
import { ChangeEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Plus as PlusIcon } from 'react-feather';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import { toast } from 'react-toastify';
import Button, { ButtonProps } from 'src/components/Button';
import { CardBody, CardHeader } from 'src/components/card';
import { Container } from 'src/components/container';
import { Form, FormField, Input, Label, TextArea } from 'src/components/form';
import { GridContainer, GridItem } from 'src/components/grid';
import Popper from 'src/components/Popper';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { collections } from 'src/firebase/collections';
import useComponentDidUpdate from 'src/hooks/useComponentDidUpdate';
import { User, useUserStore } from 'src/store';
import { useManagementStore } from 'src/store/management';

type FormDataState = {
  type: {
    value: 'income' | 'outcome';
    helperText?: string | undefined | null;
  };
  value: {
    value: string;
    helperText?: string | undefined | null;
  };
  time: {
    value: Date;
    helperText?: string | undefined | null;
  };
  content: {
    value: string;
    helperText?: string | undefined | null;
  };
  categories: {
    value: string[];
    helperText?: string | undefined | null;
  };
};

type ReactSelectOption = {
  value: string;
  label: string;
};

export default function Add(props: Partial<ButtonProps>) {
  const user = useUserStore((state) => state.user as User);
  const categories = useManagementStore((state) => state.categories);

  const categoriesOptions = useMemo<ReactSelectOption[]>(() => {
    if (!categories) return [];
    return categories.map((item) => ({ value: item.id, label: item.name }));
  }, [categories]);

  const [openPopper, setOpenPopper] = useState<boolean>(false);
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    type: {
      value: 'income',
    },
    value: {
      value: '0',
      helperText: null,
    },
    time: {
      value: new Date(),
      helperText: null,
    },
    content: {
      value: '',
    },
    categories: {
      value: [],
    },
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const submitBtnDisabled = Boolean(
    formData.categories.helperText ||
      formData.content.helperText ||
      formData.time.helperText ||
      formData.value.helperText ||
      formData.type.helperText ||
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
    (name: 'type' | 'value' | 'content' | 'categories') =>
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(
        produce((d) => {
          d[name].value = ev.target.value;
        })
      );
    };

  const handleTimeChange = (date: Date | null) => {
    setFormData(
      produce((d) => {
        d.time.value = date ?? new Date();
      })
    );
  };

  const handleCategoriesChange: ReactSelectProps<ReactSelectOption, true>['onChange'] = (newValue) => {
    setFormData(
      produce((d) => {
        d.categories.value = newValue.map((item) => item.value);
      })
    );
  };

  const validateForm = (formData: FormDataState) => {
    let flag = true;
    setFormData(
      produce((d) => {
        const check = (isInvalid: boolean, field: keyof FormDataState, message: string) => {
          if (isInvalid) {
            flag = false;
            d[field].helperText = message;
          } else {
            d[field].helperText = null;
          }
        };
        check(!['income', 'outcome'].includes(formData.type.value), 'type', 'Please choose one type');
        check(!formData.value.value || isNaN(Number(formData.value.value)), 'value', 'Please enter a number');
        check(!(formData.time.value instanceof Date), 'time', 'Invalid date');
      })
    );
    return flag;
  };

  const handleAdd = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    if (!validateForm(formData)) return;
    try {
      setIsAdding(true);
      await addDoc(collections.inOut, {
        type: formData.type.value,
        content: formData.content.value,
        time: formData.time.value.getTime(),
        categories: formData.categories.value,
        uid: user.uid,
        value: Number(formData.value.value),
      });
      toast.success('Added successfully');
      setFormData({
        type: {
          value: formData.type.value,
        },
        value: {
          value: '0',
          helperText: null,
        },
        time: {
          value: new Date(),
          helperText: null,
        },
        content: {
          value: '',
        },
        categories: {
          value: [],
        },
      });
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
                    checked={formData.type.value === 'income'}
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
                    checked={formData.type.value === 'outcome'}
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
                      value={formData.value.value}
                      onChange={getInputChangeHandler('value')}
                      error={!!formData.value.helperText}
                      helperText={formData.value.helperText}
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
                        selected={formData.time.value}
                        customInput={<Input />}
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
                  value={formData.content.value}
                  onChange={getInputChangeHandler('content')}
                  error={!!formData.content.helperText}
                  helperText={formData.content.helperText}
                />
              </FormField>
              <FormField>
                <Label htmlFor="categories">Categories</Label>
                <ReactSelect
                  isMulti
                  options={categoriesOptions}
                  onChange={handleCategoriesChange}
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
