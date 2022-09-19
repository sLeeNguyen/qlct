import { useEffect } from 'react';
import { Container } from 'src/components/container';
import { GridContainer, GridItem } from 'src/components/grid';
import requireAuth from 'src/components/requireAuth';
import MainLayout from 'src/layouts/MainLayout';
import BalanceOverall from 'src/modules/dashboard/BalanceOverall';
import IncomeStatistic from 'src/modules/dashboard/IncomeStatistic';
import OutcomeStatistic from 'src/modules/dashboard/OutcomeStatistic';
import RevenueAndExpenditureHistory from 'src/modules/dashboard/RevenueAndExpenditureHistory';
import { useUserStore } from 'src/store';
import { useDashboardStore } from 'src/store/dashboard';

function Dashboard() {
  const user = useUserStore((state) => state.user);
  const [fetchOverall, fetchHistories] = useDashboardStore((state) => [state.fetchOverall, state.fetchHistories]);

  useEffect(() => {
    if (user) {
      fetchOverall(user.uid);
      fetchHistories(user.uid);
    }
  }, [user, fetchOverall, fetchHistories]);

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
