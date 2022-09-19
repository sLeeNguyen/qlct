import IncomeImg from 'public/images/income.png';
import OutcomeImg from 'public/images/outcome.png';
//
import chroma from 'chroma-js';
import { FirebaseError } from 'firebase/app';
import { addDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect } from 'react';
import { ArrowDown as ArrowDownIcon, ArrowUp as ArrowUpIcon } from 'react-feather';
import { toast } from 'react-toastify';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardBody, CardTitleText } from 'src/components/card';
import { Container } from 'src/components/container';
import { GridContainer, GridItem } from 'src/components/grid';
import requireAuth from 'src/components/requireAuth';
import { Text, TextSmall } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { collections } from 'src/firebase/collections';
import MainLayout from 'src/layouts/MainLayout';
import { useUserStore } from 'src/store';
import { useDashboardStore } from 'src/store/dashboard';
import RevenueAndExpenditureHistory from 'src/modules/dashboard/RevenueAndExpenditureHistory';
import BalanceOverall from 'src/modules/dashboard/BalanceOverall';
import IncomeStatistic from 'src/modules/dashboard/IncomeStatistic';
import OutcomeStatistic from 'src/modules/dashboard/OutcomeStatistic';

function Dashboard() {
  const user = useUserStore((state) => state.user);
  const [fetchOverall, fetchHistories] = useDashboardStore((state) => [state.fetchOverall, state.fetchHistories]);

  useEffect(() => {
    if (user) {
      fetchOverall(user.uid);
      fetchHistories(user.uid);
    }
  }, [user, fetchOverall, fetchHistories]);

  const handleAddInOut = async () => {
    try {
      if (!user) {
        throw new Error('User not found');
      }
      const data = {
        content: 'Banh mi',
        value: 34000,
        type: 'outcome',
        uid: user?.uid,
        time: new Date().getTime(),
        categories: ['WBzwxnmWbvZ9ipcEcQLK', ''],
      };
      await addDoc(collections.inOut, data);
      toast.success('Added successfully');
    } catch (error) {
      console.error(error);
      let msg = 'Error';
      if (error instanceof FirebaseError) {
        msg = error.code;
      }
      toast.error(msg);
    }
  };

  return (
    <Container maxWidth="xl">
      <GridContainer spacing={4}>
        <GridItem xs={5}>
          <BalanceOverall />
        </GridItem>
        <GridItem xs={7}>
          <GridContainer colSpacing={4} spacing={0} css={{ height: '100%' }}>
            <GridItem xs={12} sm={6}>
              <IncomeStatistic />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <OutcomeStatistic />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12}>
          <RevenueAndExpenditureHistory />
        </GridItem>
      </GridContainer>
    </Container>
  );
}

const DashboardAuth = Object.assign(requireAuth(Dashboard), { Layout: MainLayout });

export default DashboardAuth;
