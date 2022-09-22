import { doc, writeBatch } from 'firebase/firestore';
import { useMemo, useState } from 'react';
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
import { useInOutListStore } from './store';

export default function Delete() {
  const user = useUserStore((state) => state.user as User);
  const selectedItems = useInOutListStore((state) => state.selectedItems);
  const fetchInOut = useManagementStore((state) => state.fetchInOut);

  const isShow = useMemo(() => Object.keys(selectedItems).length > 0, [selectedItems]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDeleteItems = async () => {
    try {
      setDeleting(true);
      const arrSelectedItems = Object.keys(selectedItems);
      if (arrSelectedItems.length > 0) {
        const wb = writeBatch(firebase.db);
        arrSelectedItems.forEach((id) => {
          wb.delete(doc(collections.inOut, id));
        });
        await wb.commit();
        fetchInOut(user.uid);
        toast.success('Deleted successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
    setDeleting(false);
    setOpen(false);
  };

  if (!isShow) return null;

  return (
    <>
      <Button
        ref={setAnchorEl}
        size="small"
        variant="contained"
        color="error"
        startIcon={<Trash2Icon size={16} />}
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <Popper open={open} anchorEl={anchorEl} arrow>
        <Container maxWidth={300}>
          <div css={{ padding: '12px' }}>
            <Text>Are you sure to delete the selected items?</Text>
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
                onClick={handleDeleteItems}
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
