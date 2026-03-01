// src/layouts/PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import PublicNavbar from '@/components/public/PublicNavbar';

const PublicLayout = () => {
  return (
    <div>
      <PublicNavbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Outlet /> {/* This renders the page content */}
      </main>
    </div>
  );
};

export default PublicLayout;