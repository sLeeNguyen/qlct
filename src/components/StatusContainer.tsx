import { FS } from 'src/configs/fs';

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
    return <span>error</span>;
  }

  return <>{children}</>;
}
