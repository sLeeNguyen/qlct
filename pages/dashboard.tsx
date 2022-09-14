import requireAuth from 'src/components/requireAuth';

function Dashboard() {
  return <div>Dashboard</div>;
}

export default requireAuth(Dashboard);
