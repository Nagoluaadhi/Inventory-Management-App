import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout({ user }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-4">
        <div className="text-orange-500 text-lg font-bold mb-6">📦 Barcode System</div>
        <nav className="flex flex-col gap-3 text-sm">
  {user?.role === 'admin' && (
    <>
      <Link to="/app/dashboard" className="hover:text-orange-500">Dashboard</Link>
      <Link to="/app/stockin" className="hover:text-orange-500">Stock IN</Link>
      <Link to="/app/outward" className="hover:text-orange-500">Outward</Link>
      <Link to="/app/services" className="hover:text-orange-500">Services</Link>
      <Link to="/app/report" className="hover:text-orange-500">Report</Link>
      <Link to="/app/user-management" className="hover:text-orange-500">User Management</Link>
    </>
  )}

  {user?.role === 'supervisor' && (
    <>
      <Link to="/app/outward" className="hover:text-orange-500">Outward</Link>
      <Link to="/app/report" className="hover:text-orange-500">Report</Link>
    </>
  )}

  {user?.role === 'user' && (
    <>
      <Link to="/app/outward" className="hover:text-orange-500">Outward</Link>
      <Link to="/app/services" className="hover:text-orange-500">Services</Link>
      <Link to="/app/report" className="hover:text-orange-500">Report</Link>
    </>
  )}
</nav>

      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h1 className="text-xl font-semibold"></h1>
          <button
  onClick={() => {
    localStorage.clear();
    window.location.href = '/';
  }}
  className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
>
  Logout
</button>

        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
