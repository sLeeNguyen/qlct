/* eslint-disable @typescript-eslint/no-non-null-assertion */
import chroma from 'chroma-js';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import produce from 'immer';
import { useEffect, useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import Modal from 'react-modal';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import { toast } from 'react-toastify';
import Button from 'src/components/Button';
import { Form, FormField, Input, Label, TextArea } from 'src/components/form';
import { GridContainer, GridItem } from 'src/components/grid';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { collections, InOutDoc } from 'src/firebase/collections';
import { RequireID } from 'src/global';
import { useManagementStore } from 'src/store';
import { FormDataState, FormDataStateHelperText, ReactSelectOption } from './Add';

interface EditProps {
  item?: RequireID<InOutDoc>;
  open?: ReactModal.Props['isOpen'];
  onClose?: ReactModal.Props['onRequestClose'];
  onAfterUpdate?: () => Promise<void>;
}

const customStyles: ReactModal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    width: '100%',
    overflow: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
};

export default function Edit(props: EditProps) {
  const { item, open, onClose, onAfterUpdate } = props;
  const categories = useManagementStore((state) => state.categories);

  const formCategories = useMemo(() => {
    if (categories && item?.categories) {
      return categories
        .filter((c) => item.categories.includes(c.id!))
        .map((c) => ({ value: c.id as string, label: c.name }));
    }
    return [];
  }, [categories, item]);

  const categoriesOptions = useMemo<ReactSelectOption[]>(() => {
    if (!categories) return [];
    return categories.map((item) => ({ value: item.id as string, label: item.name }));
  }, [categories]);

  const [formData, setFormData] = useState<FormDataState>({
    type: item?.type ?? 'outcome',
    value: String(item?.value ?? '0'),
    time: item?.time ? new Date(item.time) : undefined,
    content: item?.content ?? '',
    categories: formCategories,
  });
  const [formDataHelperText, setFormDataHelperText] = useState<FormDataStateHelperText>({
    type: null,
    value: null,
    time: null,
    content: null,
    categories: null,
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const submitBtnDisabled = Boolean(
    formDataHelperText.categories ||
      formDataHelperText.content ||
      formDataHelperText.time ||
      formDataHelperText.value ||
      formDataHelperText.type ||
      isUpdating
  );

  useEffect(() => {
    setFormData({
      type: item?.type ?? 'outcome',
      value: String(item?.value ?? '0'),
      time: item?.time ? new Date(item.time) : undefined,
      content: item?.content ?? '',
      categories: formCategories,
    });
    setFormDataHelperText({
      type: null,
      value: null,
      time: null,
      content: null,
      categories: null,
    });
  }, [item, formCategories]);

  const getInputChangeHandler =
    (name: 'type' | 'value' | 'content') => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  useEffect(() => {
    validateForm(formData);
  }, [formData]);

  const handleUpdate = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    if (!validateForm(formData)) return;

    try {
      setIsUpdating(true);
      if (!item) throw new Error('Item not found!');
      await updateDoc(doc(collections.inOut, item.id!), {
        type: formData.type,
        content: formData.content,
        time: Timestamp.fromDate(formData.time!),
        categories: formData.categories.map((item) => item.value),
        value: Number(formData.value),
      });
      toast.success('Updated successfully');
      onAfterUpdate && onAfterUpdate();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
    setIsUpdating(false);
  };

  return (
    <Modal
      isOpen={Boolean(open)}
      contentLabel="modal item edit"
      style={customStyles}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      preventScroll
      onRequestClose={onClose}
    >
      <div css={{ marginBottom: 24 }}>
        <Text color={colors.primary} css={{ fontWeight: 600, fontSize: 20, textAlign: 'center' }}>
          Update Item
        </Text>
      </div>
      <div>
        <Form onSubmit={handleUpdate} noValidate autoComplete={'off'}>
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
                  <ReactDatePicker
                    id="time"
                    name="time"
                    showTimeSelect
                    selected={formData.time}
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
          <div css={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              disabled={isUpdating}
              css={{ marginRight: 24 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              disabled={submitBtnDisabled}
              loading={isUpdating}
            >
              Update
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
