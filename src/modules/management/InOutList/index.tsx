import styled from '@emotion/styled';
import chroma from 'chroma-js';
import Checkbox from 'src/components/Checkbox';
import Pagination from 'src/components/Pagination';
import { Text, TextSmall } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import usePagination from 'src/hooks/usePagination';
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

const list = [
  {
    id: 1,
    time: '22-09-02 18:00:02',
    content: 'salary 8/22 salary 8/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 2,
    time: '22-09-02 18:00:02',
    content: 'salary 7/22 salary 8/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 3,
    time: '22-09-02 18:00:02',
    content: 'salary 8/22 salary 8/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 4,
    time: '22-09-02 18:00:02',
    content: 'salary 12/22 salary 8/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 5,
    time: '22-09-02 18:00:02',
    content: 'salary 12/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 6,
    time: '22-09-02 18:00:02',
    content: 'salary 12/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 7,
    time: '22-09-02 18:00:02',
    content: 'salary 0/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 8,
    time: '22-09-02 18:00:02',
    content: 'salary 0/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 9,
    time: '22-09-02 18:00:02',
    content: 'salary 0/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 10,
    time: '22-09-02 18:00:02',
    content: 'salary 0/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
  {
    id: 11,
    time: '22-09-02 18:00:02',
    content: 'salary 0/22 salary 2/22 salary 8/22 salary 8/22',
    value: 22020202,
    type: 'income',
  },
];

export default function InOutList() {
  const { numberOfPages, page, renderList, from, to, total, setPage } = usePagination({ data: list, pageSize: 5 });

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
            {renderList.map((item) => (
              <tr key={item.id}>
                <TableCell>
                  <Checkbox size={18} />
                </TableCell>
                <TableCell noWrap>{item.time}</TableCell>
                <TableCell>{item.content}</TableCell>
                <TableCell noWrap align="right">
                  {item.value}
                </TableCell>
                <TableCell noWrap align="center">
                  {item.time === 'income' ? 'In' : 'Out'}
                </TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
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
      </ResponsiveTable>
    </div>
  );
}
