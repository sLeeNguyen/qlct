import FacebookIcon from 'public/icons/facebook.svg';
import GithubIcon from 'public/icons/github.svg';
import GmailIcon from 'public/icons/gmail.svg';
import Logo from 'public/images/logo.png';
//
import styled from '@emotion/styled';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'react-feather';
import { toast } from 'react-toastify';
import Button from 'src/components/Button';
import Checkbox from 'src/components/Checkbox';
import Link from 'src/components/Link';
import { Text, TextSmall } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import firebase from 'src/firebase';
import useComponentDidUpdate from 'src/hooks/useComponentDidUpdate';
import { User, useUserStore } from 'src/store';

const Wrapper = styled.div({
  minHeight: 'calc(100vh - 32px)',
  display: 'flex',
  alignItems: 'center',
  padding: 16,
});

const Container = styled.div({
  maxWidth: 500,
  width: '100%',
  margin: 'auto',
});

const SignInCard = styled.div({
  backgroundColor: colors.surface,
  padding: 32,
  boxShadow: '0px 0px 16px 2px #C5C5C540',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 8,

  '& > *:not(:last-child)': {
    marginBottom: 36,
  },
});

const Form = styled.form({
  width: '100%',
  '& > *:not(:last-child)': {
    marginBottom: 16,
  },
});

const Label = styled.label({
  fontSize: '14px',
  color: colors.textPrimary,
  lineHeight: 17 / 14,
});

const FormField = styled.div<{ row?: boolean }>((props) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: props.row ? 'row' : 'column',
  '& > :not(:last-child)': {
    marginBottom: 6,
  },
}));

const InputWithIcon = styled.div<{ position: 'start' | 'end' }>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '& .inp-icon-end': {
    position: 'absolute',
    top: 0,
    right: 12,
    transform: 'translateY(50%)',
    cursor: 'pointer',
    ':hover': {
      transition: '250ms all linear',
      color: colors.primary,
    },
  },
  '& > input': {
    paddingRight: props.position === 'end' ? 44 : undefined,
    paddingLeft: props.position === 'start' ? 44 : undefined,
  },
}));

const Input = styled.input<{ error?: boolean }>((props) => ({
  borderRadius: 4,
  border: '1px solid',
  borderColor: props.error ? colors.error : 'rgba(110, 107, 123, 0.35)',
  outlineColor: props.error ? colors.error : colors.primary,
  color: 'inherit',
  padding: '10px 12px',
  fontSize: 16,
  fontWeight: 300,
}));

export default function SignInPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [emailHelperText, setEmailHelperText] = useState<string | undefined>();
  const [password, setPassword] = useState('');
  const [passwordHelperText, setPasswordHelperText] = useState<string | undefined>();
  const [signIn, signOut, isAuthenticated] = useUserStore((state) => [
    state.signIn,
    state.signOut,
    state.isAuthenticated,
  ]);

  const btnDisabled = Boolean(isSigningIn || emailHelperText || passwordHelperText);

  const validateForm = useCallback(() => {
    let isValid = true;
    if (!email) {
      isValid = false;
      setEmailHelperText('This field is required');
    } else {
      setEmailHelperText(undefined);
    }
    if (!password) {
      isValid = false;
      setPasswordHelperText('This field is required');
    } else {
      setPasswordHelperText(undefined);
    }
    return isValid;
  }, [email, password]);

  const handleSignIn = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSigningIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password);
      signIn(userCredential.user.toJSON() as User);
      toast.success('Signed In');
    } catch (error) {
      console.error(error);
      signOut();
      let msg = 'Something was wrong';
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          msg = 'Username or email does not exist';
        } else if (error.code === 'auth/wrong-password') {
          msg = 'Invalid password';
        }
      }
      toast.error(msg);
    }
    setIsSigningIn(false);
  };

  const handleEmailChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setEmail(ev.target.value);
  };

  const handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  };

  useComponentDidUpdate(() => {
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Wrapper>
      <Container>
        <SignInCard>
          <div>
            <Image
              src={Logo.src}
              blurDataURL={Logo.blurDataURL}
              alt="logo"
              layout="intrinsic"
              width={Logo.width / 1.2}
              height={Logo.height / 1.2}
              quality={100}
              priority
            />
          </div>
          <div
            css={{
              width: '100%',
            }}
          >
            <Text
              css={{
                fontWeight: 500,
                marginBottom: 16,
                fontSize: 24,
              }}
            >
              Welcome to <strong css={{ color: colors.primary }}>QLTC</strong>!
            </Text>
            <Text>Please sign-in to your account and start the adventure</Text>
          </div>
          <Form onSubmit={handleSignIn} noValidate autoComplete="on">
            <FormField>
              <Label htmlFor="email">Username or Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                autoComplete="username"
                error={emailHelperText !== undefined}
              />
              {emailHelperText && <TextSmall color={colors.error}>{emailHelperText}</TextSmall>}
            </FormField>
            <FormField>
              <div
                css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Label htmlFor="password">Password</Label>
                <NextLink href={'/forgot-password'}>
                  <Link css={{ fontSize: '14px' }}>Forgot Password?</Link>
                </NextLink>
              </div>
              <InputWithIcon position="end">
                <Input
                  id="password"
                  name="password"
                  type={isShowPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete={isShowPassword ? 'off' : 'current-password'}
                  error={passwordHelperText !== undefined}
                />
                {isShowPassword ? (
                  <EyeOffIcon size={20} className="inp-icon-end" onClick={() => setIsShowPassword(false)} />
                ) : (
                  <EyeIcon size={20} className="inp-icon-end" onClick={() => setIsShowPassword(true)} />
                )}
              </InputWithIcon>
              {passwordHelperText && <TextSmall color={colors.error}>{passwordHelperText}</TextSmall>}
            </FormField>
            <FormField row>
              <Checkbox id="remember-me" name="remember-me" label="Remember Me" css={{ fontSize: '14px' }} />
            </FormField>
            <Button fullWidth color="primary" variant="contained" loading={isSigningIn} disabled={btnDisabled}>
              Sign In
            </Button>
          </Form>
          <div css={{ width: '100%', textAlign: 'center' }}>
            <Text>
              Don&#39;t have an account?&nbsp;
              <NextLink href={'/sign-up'}>
                <Link>Sign Up</Link>
              </NextLink>
            </Text>
            <div
              css={{
                borderTop: '1px solid rgba(110, 107, 123, 0.35)',
                position: 'relative',
                margin: '28px 0px',
              }}
            >
              <div
                css={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -55%)',
                  padding: '4px 8px',
                  backgroundColor: colors.surface,
                }}
              >
                <Text as="span">or</Text>
              </div>
            </div>
            <div
              css={{
                '& img': {
                  cursor: 'pointer',
                },
                '& > *:not(:last-child)': {
                  marginRight: 20,
                },
              }}
            >
              <img src={FacebookIcon.src} alt="facebook" title="Login with Facebook" />
              <img src={GmailIcon.src} alt="google" title="Login with Google" />
              <img src={GithubIcon.src} alt="github" title="Login with Github" />
            </div>
          </div>
        </SignInCard>
      </Container>
    </Wrapper>
  );
}
