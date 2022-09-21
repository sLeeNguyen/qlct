import { doc, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { Trash2 as Trash2Icon } from 'react-feather';
import { toast } from 'react-toastify';
import Button from 'src/components/Button';
import { Container } from 'src/components/container';
import Popper from 'src/components/Popper';
import { Text } from 'src/components/Text';
import firebase from 'src/firebase';
import { collections } from 'src/firebase/collections';
import { User, useUserStore } from 'src/store';
import { useManagementStore } from 'src/store/management';
import { useYourCategoriesStore } from './store';

export default function Delete() {
  const selectedCategories = useYourCategoriesStore((state) => state.selectedCategories);
  const fetchCategories = useManagementStore((state) => state.fetchCategories);
  const user = useUserStore((state) => state.user as User);

  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const deleteCategories = async () => {
    const arrSelectedCategories = Object.keys(selectedCategories);
    if (arrSelectedCategories.length > 0) {
      const wb = writeBatch(firebase.db);
      arrSelectedCategories.forEach((id) => {
        wb.delete(doc(collections.category, id));
      });
      try {
        setDeleting(true);
        await wb.commit();
        fetchCategories(user.uid);
      } catch (error) {
        console.error(error);
        toast.error((error as Error).message);
      }
    }
    setDeleting(false);
    setOpen(false);
  };

  const handleOpenConfirmDialog = () => {
    if (Object.keys(selectedCategories).length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
      toast.error('No items selected', {
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <span ref={setAnchorEl}>
        <Trash2Icon
          className={`category-action${open ? ' focused' : ''}`}
          size={16}
          strokeWidth={2.5}
          onClick={handleOpenConfirmDialog}
        />
      </span>
      <Popper open={open} anchorEl={anchorEl} arrow>
        <Container maxWidth={300}>
          <div css={{ padding: '12px' }}>
            <Text>Are you sure to delete the selected categories?</Text>
            <div
              css={{
                display: 'flex',
                justifyContent: 'flex-end',
                '> *:not(:last-child)': {
                  marginRight: 12,
                },
                '> button': {
                  padding: '4px 10px',
                  fontSize: 14,
                },
                marginTop: 12,
              }}
            >
              <Button size="small" variant="outlined" color="error" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={deleteCategories}
                loading={deleting}
                disabled={deleting}
              >
                OK
              </Button>
            </div>
          </div>
        </Container>
      </Popper>
    </>
  );
}
