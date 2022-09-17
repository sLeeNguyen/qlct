import AvtDefaultImg from 'public/images/avt_default.png';
import LogoImg from 'public/images/logo.png';
//
import styled from '@emotion/styled';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';

const HeaderRoot = styled.header({
  height: 50,
  backgroundColor: colors.surface,
  borderBottom: '1px solid rgba(110, 107, 123, 0.35)',
  padding: '0 32px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
});

const NavList = styled.nav({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  margin: '0 16px',
  flexGrow: 1,
});

interface NavItemProps {
  active?: boolean;
}
const NavItem = styled.a<NavItemProps>((props) => ({
  height: '100%',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: '2px solid',
  borderBottomColor: props.active ? colors.primary : 'transparent',
  color: props.active ? colors.primary : colors.textPrimary,
  fontWeight: 400,
  cursor: 'pointer',
  transition: '250ms color ease',
  padding: '0 16px',
  '&:hover': {
    textDecoration: 'none',
    color: colors.primary,
  },
}));

const UserBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    [String(Text)]: {
      color: colors.primary,
    },
  },
});

export default function Header() {
  const router = useRouter();

  return (
    <HeaderRoot>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image src={LogoImg.src} width={44} height={36} alt={'logo'} />
        <Text color={colors.primary} css={{ marginLeft: 12, fontWeight: 400, fontSize: 24 }}>
          QLTC
        </Text>
      </div>
      <NavList>
        <NextLink href={'/dashboard'}>
          <NavItem active={router.route === '/dashboard'}>Dashboard</NavItem>
        </NextLink>
        <NextLink href={'/management'}>
          <NavItem active={router.route === '/management'}>Management</NavItem>
        </NextLink>
      </NavList>
      <UserBox>
        <Image
          css={{
            borderRadius: '50%',
          }}
          src={AvtDefaultImg}
          width={36}
          height={36}
          blurDataURL={AvtDefaultImg.blurDataURL}
          alt={'avatar'}
        />
        <Text css={{ fontWeight: 400, marginLeft: 8, transition: '250ms all ease' }}>Admin</Text>
      </UserBox>
    </HeaderRoot>
  );
}
