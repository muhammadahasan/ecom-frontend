import DashboardLayout from "../../components/layout/DashboardLayout.jsx";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div>Dashboard</div>
      <a href="/categories" style={{ display: 'block', marginTop: '20px' }}>Manage Categories →</a>
    </DashboardLayout>
  );
}
