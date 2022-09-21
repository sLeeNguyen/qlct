import styled from '@emotion/styled';
import chroma from 'chroma-js';
import React, { useEffect, useState } from 'react';
import Checkbox from 'src/components/Checkbox';
import Pagination from 'src/components/Pagination';
import StatusContainer from 'src/components/StatusContainer';
import { Text, TextSmall } from 'src/components/Text';
import { FS } from 'src/configs/fs';
import { colors } from 'src/configs/theme';
import usePagination from 'src/hooks/usePagination';
import { User, useUserStore } from 'src/store';
import { useManagementStore } from 'src/store/management';
import ListActions from './ListActions';

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
  const [status, fetchInOut, data, numberOfInOuts] = useManagementStore((state) => [
    state.inOutFS,
    state.fetchInOut,
    state.revenuesAndExpenditures,
    state.numberOfInOuts,
  ]);

  const [pageSize] = useState<number>(10);
  const { numberOfPages, page, from, to, total, setPage } = usePagination({ total: numberOfInOuts ?? 0, pageSize });

  useEffect(() => {
    fetchInOut(user.uid, {
      page,
      pageSize,
    });
  }, [page, pageSize, user, fetchInOut]);

  return (
    <div>
      <div css={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Text as="h1" css={{ flexGrow: 1, fontSize: 24, fontWeight: 500, lineHeight: '29.26px' }}>
          List of revenues and expenditures
        </Text>
        <ListActions />
      </div>
      <ResponsiveTable>
        <Table>
          <TableHead>
            <tr>
              <TableCell as="th">
                <Checkbox size={18} />
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
              data?.map((item) => (
                <tr key={item.id}>
                  <TableCell>
                    <Checkbox size={18} />
                  </TableCell>
                  <TableCell noWrap>{new Date(item.time).toLocaleString()}</TableCell>
                  <TableCell>{item.content}</TableCell>
                  <TableCell noWrap align="right">
                    {item.value}
                  </TableCell>
                  <TableCell noWrap align="center">
                    {item.type === 'income' ? 'In' : 'Out'}
                  </TableCell>
                </tr>
              ))}
          </TableBody>
        </Table>
        <StatusContainer status={status}>
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
              Show {from} - {to} of {total}
            </TextSmall>
          </div>
        </StatusContainer>
      </ResponsiveTable>
    </div>
  );
}

export default React.memo(InOutList);
