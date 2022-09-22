import { addDoc } from 'firebase/firestore';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'src/components/Button';
import { Form, FormField, Input, Label, TextArea } from 'src/components/form';
import { colors } from 'src/configs/theme';
import { collections } from 'src/firebase/collections';
import useComponentDidUpdate from 'src/hooks/useComponentDidUpdate';
import { User, useUserStore } from 'src/store';
import { useManagementStore } from 'src/store/management';
import { useYourCategoriesStore } from './store';

type AddCategoryFormData = {
  name: string;
  description: string;
};
type AddCategoryFormDataHelperText = {
  name?: string | null | undefined;
  description?: string | null | undefined;
};

export default function AddForm() {
  const user = useUserStore((state) => state.user as User);
  const fetchCategories = useManagementStore((state) => state.fetchCategories);
  const [openAddForm, toggleAddForm] = useYourCategoriesStore((state) => [state.openAddForm, state.toggleAddForm]);

  const [formData, setFormData] = useState<AddCategoryFormData>({
    name: '',
    description: '',
  });
  const [formDataHelperText, setFormDataHelperText] = useState<AddCategoryFormDataHelperText>({
    name: null,
    description: null,
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const submitBtnDisabled = Boolean(isAdding || formDataHelperText.name || formDataHelperText.description);

  const validateForm = (formData: AddCategoryFormData) => {
    let flag = true;

    if (!formData.name) {
      setFormDataHelperText((state) => ({ ...state, name: 'This field is required' }));
      flag = false;
    } else {
      setFormDataHelperText((state) => ({ ...state, name: null }));
    }

    if (!formData.description) {
      setFormDataHelperText((state) => ({ ...state, description: 'This field is required' }));
      flag = false;
    } else {
      setFormDataHelperText((state) => ({ ...state, description: null }));
    }

    return flag;
  };

  const handleAddCategory = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    if (!validateForm(formData)) return;
    try {
      setIsAdding(true);
      await addDoc(collections.category, {
        name: formData.name,
        description: formData.description,
        uid: user.uid,
      });
      fetchCategories(user.uid);
      toast.success('Added successfully');
    } catch (error) {
      console.error('Failed to create category', error);
      toast.error((error as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  const getInputChangeHandler =
    (field: keyof AddCategoryFormData) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((state) => ({ ...state, [field]: ev.target.value }));
    };

  useComponentDidUpdate(() => {
    validateForm(formData);
  }, [formData]);

  if (!openAddForm) return null;

  return (
    <div
      css={{
        margin: '16px 20px 8px',
        paddingBottom: 16,
        borderBottom: '1px solid',
        borderBottomColor: 'rgba(110, 107, 123, 0.5)',
        position: 'relative',
        backgroundColor: colors.surface,
      }}
    >
      <div
        css={{
          position: 'absolute',
          top: 0,
          right: 28,
          width: 16,
          height: 16,
          transform: 'translate(0px, -20px) rotate(45deg)',
          backgroundColor: 'inherit',
        }}
      />
      <Form onSubmit={handleAddCategory} noValidate>
        <FormField>
          <Label htmlFor="category-name">Name</Label>
          <Input
            fullWidth
            id="category-name"
            name="category-name"
            type="text"
            value={formData.name}
            onChange={getInputChangeHandler('name')}
            error={Boolean(formDataHelperText.name)}
            helperText={formDataHelperText.name}
          />
        </FormField>
        <FormField>
          <Label htmlFor="category-description">Description</Label>
          <TextArea
            fullWidth
            id="category-description"
            name="category-description"
            rows={3}
            value={formData.description}
            onChange={getInputChangeHandler('description')}
            error={Boolean(formDataHelperText.description)}
            helperText={formDataHelperText.description}
          />
        </FormField>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            '> *:not(:last-child)': {
              marginRight: 16,
            },
          }}
        >
          <Button type="button" variant="outlined" color="error" size="small" onClick={toggleAddForm}>
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={submitBtnDisabled}
            loading={isAdding}
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
}
