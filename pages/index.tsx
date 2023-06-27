import SaveMoneyImg from 'public/images/save_money.png';
//
import Image from 'next/image';
import NextLink from 'next/link';
import Button from 'src/components/Button';
import Link from 'src/components/Link';
import { Text } from 'src/components/Text';
import { Fragment } from 'react';
import Head from 'next/head';

export default function IndexPage() {
  return (
    <Fragment>
      <Head>
        <title>Welcome to QLTC</title>
      </Head>
      <div
        css={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
        }}
      >
        <div
          css={{
            width: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            css={{
              width: 500,
            }}
          >
            <Image
              src={SaveMoneyImg.src}
              blurDataURL={SaveMoneyImg.blurDataURL}
              alt="qltc"
              layout="responsive"
              width={SaveMoneyImg.width}
              height={SaveMoneyImg.height}
              priority
            />
          </div>
        </div>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div css={{ height: 200 }}>
            <Text
              css={{
                fontSize: 40,
                fontWeight: 500,
                lineHeight: 1.1,
                marginBottom: 32,
              }}
            >
              Welcome to QLTC
            </Text>
            <div css={{ textAlign: 'center' }}>
              <NextLink href={'/dashboard'}>
                <Link
                  css={{
                    ':hover': {
                      textDecoration: 'none',
                    },
                  }}
                >
                  <Button color="primary" css={{ width: 200 }}>
                    Join
                  </Button>
                </Link>
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
