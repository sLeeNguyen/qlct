import { RefreshCw as RefreshCwIcon } from 'react-feather';
import { FS } from 'src/configs/fs';
import { colors } from 'src/configs/theme';
import { useUtilsStore } from 'src/store/utils';
import Spinner from './Spinner';
import { Text } from './Text';

export default function SyncData() {
  const [syncFS, syncData] = useUtilsStore((state) => [state.syncFS, state.syncData]);
  // const [isHover, setIsHover] = useState<boolean>(false);

  const isSyncing = syncFS === FS.FETCHING || syncFS === FS.UPDATING;

  return (
    <span
      css={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: colors.surface,
        boxShadow: '0 0 10px 4px rgba(0, 0, 0, 0.05)',
        padding: 10,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: '250ms all ease',
        width: 40,
        overflow: 'hidden',
        '.icon': {
          minWidth: 20,
        },
        [String(Text)]: {
          visibility: 'hidden',
          opacity: 0,
          whiteSpace: 'nowrap',
          marginLeft: 10,
          color: 'inherit',
          fontWeight: 400,
        },
        ':hover, &.syncing': {
          boxShadow: '0 0 10px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: 20,
          color: colors.primary,
          width: 130,
          [String(Text)]: {
            visibility: 'visible',
            opacity: 1,
          },
        },
      }}
      onClick={syncData}
      // onMouseEnter={() => setIsHover(true)}
      // onMouseLeave={() => {
      //   setTimeout(() => {
      //     setIsHover(false);
      //   }, 500);
      // }}
    >
      <div css={{ display: 'flex' }}>
        <div css="icon">{isSyncing ? <Spinner size={20} /> : <RefreshCwIcon size={20} />}</div>
        <Text>{isSyncing ? 'Syncing...' : 'Sync Data'}</Text>
      </div>
    </span>
  );
}
