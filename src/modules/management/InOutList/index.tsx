/* eslint-disable @typescript-eslint/no-non-null-assertion */
import styled from '@emotion/styled';
import chroma from 'chroma-js';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Checkbox from 'src/components/Checkbox';
import Pagination from 'src/components/Pagination';
import Spinner from 'src/components/Spinner';
import StatusContainer from 'src/components/StatusContainer';
import { Text, TextSmall } from 'src/components/Text';
import { FS } from 'src/configs/fs';
import { colors } from 'src/configs/theme';
import { InOutDoc } from 'src/firebase/collections';
import { RequireID } from 'src/global';
import usePagination from 'src/hooks/usePagination';
import { User, useUserStore } from 'src/store';
import { useManagementStore } from 'src/store/management';
import { formatNumber } from 'src/utils';
import Edit from './Edit';
import ListActions from './ListActions';
import { useInOutListStore } from './store';

const ResponsiveTable = styled.div({
  backgroundColor: colors.surface,
  borderRadius: 8,
  overflow: 'auto',
});

const Table = styled.table({
  width: '100%',
  borderRadius: 8,
  overflow: 'hidden',
});

const TableHead = styled.thead({
  backgroundColor: chroma(colors.primary).alpha(0.25).hex(),
  color: '#5A5864',
});

const TableBody = styled.tbody({
  backgroundColor: colors.surface,
  '> tr': {
    '&:hover': {
      backgroundColor: chroma(colors.primaryDarker).alpha(0.08).hex(),
    },
    '&.selected': {
      backgroundColor: chroma(colors.primaryDarker).alpha(0.2).hex(),
    },
  },
});

interface TableCellProps {
  align?: 'left' | 'right' | 'center';
  noWrap?: boolean;
}
const TableCell = styled.td<TableCellProps>((props) => ({
  padding: '12px 16px',
  textAlign: props.align ?? 'left',
  lineHeight: '19.5px',
  fontWeight: props.as === 'th' ? 500 : undefined,
  whiteSpace: props.noWrap ? 'nowrap' : undefined,
}));

function InOutList() {
  const user = useUserStore((state) => state.user as User);
  const [status, fetchInOut, normalizedData] = useManagementStore((state) => [
    state.inOutFS,
    state.fetchInOut2,
    state.revenuesAndExpenditures,
    // state.numberOfInOuts,
  ]);
  const data = useMemo<RequireID<InOutDoc>[]>(() => Object.values(normalizedData ?? {}), [normalizedData]);
  const inOutListStore = useInOutListStore();

  const [pageSize] = useState<number>(10);
  const { numberOfPages, page, from, to, total, setPage, dataShow } = usePagination({
    data,
    pageSize,
  });

  const [itemEdit, setItemEdit] = useState<RequireID<InOutDoc> | undefined>();

  const fetcher = useCallback(async () => {
    fetchInOut(user.uid);
  }, [fetchInOut, user]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const handleSelectAll = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.checked) {
      inOutListStore.selectAll(Object.keys(normalizedData ?? {}));
    } else {
      inOutListStore.deselectAll();
    }
  };

  return (
    <div>
      <div css={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Text as="h1" css={{ flexGrow: 1, fontSize: 24, fontWeight: 500, lineHeight: '29.26px' }}>
          List of incomes and outcomes
        </Text>
        <ListActions />
      </div>
      <ResponsiveTable>
        <Table>
          <TableHead>
            <tr>
              <TableCell as="th">
                <Checkbox size={18} checked={inOutListStore.isSelectAll} onChange={handleSelectAll} />
              </TableCell>
              <TableCell as="th">Time</TableCell>
              <TableCell as="th">Content</TableCell>
              <TableCell as="th" align="right">
                Value
              </TableCell>
              <TableCell as="th" align="center">
                In/Out
              </TableCell>
            </tr>
          </TableHead>
          <TableBody>
            {(status === FS.SUCCESS || status === FS.UPDATING) &&
              dataShow?.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setItemEdit(item)}
                  className={itemEdit?.id === item.id ? 'selected' : ''}
                >
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Checkbox
                      size={18}
                      checked={Boolean(inOutListStore.selectedItems[item.id])}
                      onClick={() => inOutListStore.toggleItem(item.id)}
                    />
                  </TableCell>
                  <TableCell noWrap>{new Date(item.time).toLocaleString()}</TableCell>
                  <TableCell>{item.content}</TableCell>
                  <TableCell noWrap align="right">
                    {formatNumber(item.value)}
                  </TableCell>
                  <TableCell noWrap align="center">
                    {item.type === 'income' ? 'In' : 'Out'}
                  </TableCell>
                </tr>
              ))}
          </TableBody>
        </Table>
        <StatusContainer
          status={status}
          loading={
            <div css={{ textAlign: 'center', padding: '24px 0' }}>
              <Spinner />
            </div>
          }
        >
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '16px 20px',
            }}
          >
            <Pagination nPages={numberOfPages} page={page} onChange={setPage} />
            <TextSmall css={{ minWidth: 180, textAlign: 'right' }}>
              Show {from + 1} - {to} of {total}
            </TextSmall>
          </div>
        </StatusContainer>
      </ResponsiveTable>
      <Edit
        item={itemEdit}
        open={itemEdit !== undefined}
        onClose={() => setItemEdit(undefined)}
        onAfterUpdate={() => {
          return fetcher();
        }}
      />
    </div>
  );
}

export default React.memo(InOutList);
