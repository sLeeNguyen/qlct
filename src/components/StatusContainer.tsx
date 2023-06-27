import { FS } from 'src/configs/fs';
import { X as XIcon } from 'react-feather';
import { colors } from 'src/configs/theme';
import { Text } from './Text';

export interface StatusContainerProps {
  status: FS;
  ignoreError?: boolean;
  children?: React.ReactNode;
  loading?: React.ReactNode;
}
export default function StatusContainer(props: StatusContainerProps) {
  const { status, ignoreError, loading, children } = props;
  const isLoading = status === FS.IDLE || status === FS.FETCHING;
  const isError = status === FS.FAILED;

  if (isLoading) {
    return loading ? <>{loading}</> : <span>loading...</span>;
  }

  if (!ignoreError && isError) {
    return (
      <div css={{ padding: '16px 0px', textAlign: 'center' }}>
        <XIcon color={colors.error} />
        <Text color={colors.error} css={{ fontWeight: 500 }}>
          Failed
        </Text>
      </div>
    );
  }

  return <>{children}</>;
}
