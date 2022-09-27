import AvtDefaultImg from 'public/images/avt_default.png';
import LogoImg from 'public/images/logo.png';
//
import styled from '@emotion/styled';
import chroma from 'chroma-js';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useState } from 'react';
import { LogOut as LogOutIcon, Settings as SettingsIcon } from 'react-feather';
import Popper from 'src/components/Popper';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import firebase from 'src/firebase';

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

const UserMenuItem = styled.li({});

const UserMenu = styled.ul({
  listStyle: 'none',
  minWidth: 180,
  borderRadius: 8,
  overflow: 'hidden',
  [String(UserMenuItem)]: {
    padding: '10px 20px',
    cursor: 'pointer',
    color: colors.textPrimary,
    [String(Text)]: {
      color: 'inherit',
      fontWeight: 400,
    },
    ':hover': {
      backgroundColor: chroma(colors.primaryDarker).alpha(0.08).hex(),
      color: colors.primary,
    },
    '& .icon': {
      width: 36,
      display: 'inline-flex',
      alignItems: 'center',
    },
  },
});

export default function Header() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [openUserMenu, setOpenUserMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenUserMenu(false);
    };
    if (openUserMenu) {
      window.addEventListener('click', handleClickOutside);
      return () => {
        window.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openUserMenu]);

  const handleOpenUserMenu = (ev: SyntheticEvent) => {
    ev.stopPropagation();
    setOpenUserMenu(true);
  };

  const handleSignOut = async () => {
    try {
      router.push('/');
      await signOut(firebase.auth);
      toast.success('Signed out!');
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };

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
      <UserBox ref={setAnchorEl} onClick={handleOpenUserMenu}>
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
      <Popper
        anchorEl={anchorEl}
        open={openUserMenu}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ],
          placement: 'bottom-end',
        }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <UserMenu>
          <UserMenuItem>
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="icon">
                <SettingsIcon strokeWidth={1.5} size={20} />
              </div>
              <Text>Settings</Text>
            </div>
          </UserMenuItem>
          <UserMenuItem onClick={handleSignOut}>
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="icon">
                <LogOutIcon strokeWidth={1.5} size={20} />
              </div>
              <Text>Sign out</Text>
            </div>
          </UserMenuItem>
        </UserMenu>
      </Popper>
    </HeaderRoot>
  );
}
