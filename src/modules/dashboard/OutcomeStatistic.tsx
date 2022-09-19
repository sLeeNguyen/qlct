import OutcomeImg from 'public/images/outcome.png';
//
import chroma from 'chroma-js';
import Image from 'next/image';
import { ArrowDown as ArrowDownIcon } from 'react-feather';
import { Card, CardBody, CardTitleText } from 'src/components/card';
import { Text, TextSmall } from 'src/components/Text';
import { colors } from 'src/configs/theme';

export default function OutcomeStatistic() {
  return (
    <Card css={{ height: '100%' }}>
      <CardBody>
        <div css={{ display: 'flex', flexDirection: 'row' }}>
          <div css={{ flexGrow: 1, marginRight: 8 }}>
            <CardTitleText css={{ marginBottom: 8 }}>Total outcome</CardTitleText>
            <Text css={{ color: colors.error, fontSize: 20, fontWeight: 500, marginBottom: 28 }}>
              83,000,000 <TextSmall as="span">VND</TextSmall>
            </Text>
            <TextSmall css={{ marginBottom: 4 }}>This month</TextSmall>
            <Text css={{ fontWeight: 500, marginBottom: 4 }}>
              20,000,000 <TextSmall as="span">VND</TextSmall>
            </Text>
            <TextSmall>
              <TextSmall as="span" color={colors.error}>
                <ArrowDownIcon size={16} strokeWidth={1.5} css={{ verticalAlign: 'bottom' }} /> 8,04%
              </TextSmall>
              &nbsp;
              <TextSmall as="span">last month</TextSmall>
            </TextSmall>
          </div>
          <div>
            <div
              css={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: chroma(colors.error).alpha(0.25).hex(),
                borderRadius: '50%',
                marginLeft: 'auto',
              }}
            >
              <Image src={OutcomeImg.src} blurDataURL={OutcomeImg.blurDataURL} width={40} height={40} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
