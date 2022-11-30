import { Container } from 'src/components/container';
import { GridContainer, GridItem } from 'src/components/grid';
import requireAuth from 'src/components/requireAuth';
import MainLayout from 'src/layouts/MainLayout';
import InOutList from 'src/modules/management/InOutList';
import YourCategories from 'src/modules/management/YourCategories';
//
import 'react-datepicker/dist/react-datepicker.min.css';
import { useManagementStore } from 'src/store/management';
import { Fragment, useEffect } from 'react';
import { User, useUserStore } from 'src/store';
import Head from 'next/head';

function Management() {
  const user = useUserStore((state) => state.user as User);
  const [fetchCategories] = useManagementStore((state) => [state.fetchCategories, state.fetchInOut]);

  useEffect(() => {
    fetchCategories(user.uid);
  }, [fetchCategories, user]);

  return (
    <Fragment>
      <Head>
        <title>Management - QLTC</title>
        <meta name="description" content="The first step on the journey to financial freedom" />
      </Head>
      <Container maxWidth="xl">
        <GridContainer spacing={5}>
          <GridItem xs={3}>
            <YourCategories />
          </GridItem>
          <GridItem xs={9}>
            <InOutList />
          </GridItem>
        </GridContainer>
      </Container>
    </Fragment>
  );
}

const ManagementAuth = Object.assign(requireAuth(Management), { Layout: MainLayout });

export default ManagementAuth;
