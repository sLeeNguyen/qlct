import { Container } from 'src/components/container';
import { GridContainer, GridItem } from 'src/components/grid';
import requireAuth from 'src/components/requireAuth';
import MainLayout from 'src/layouts/MainLayout';
import InOutList from 'src/modules/management/InOutList';
import YourCategories from 'src/modules/management/YourCategories';

function Management() {
  return (
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
  );
}

const ManagementAuth = Object.assign(requireAuth(Management), { Layout: MainLayout });

export default ManagementAuth;
