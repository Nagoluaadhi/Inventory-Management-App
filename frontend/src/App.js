import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StockIn from './components/StockIn';
import Outward from './components/Outward';
import Services from './components/Services';
import Report from './components/Report';
import LoginPage from './components/LoginPage';
import UserManagement from './components/UserManagement';
import Clients from './components/Clients';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />

        <Route
          path="/app"
          element={user ? <Layout user={user} /> : <Navigate to="/" />}
        >
          {user?.role === 'admin' && (
            <>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="stockin" element={<StockIn />} />
              <Route path="outward" element={<Outward />} />
              <Route path="services" element={<Services />} />
              <Route path="report" element={<Report />} />
              <Route path="clients" element={<Clients />} />
              <Route path="user-management" element={<UserManagement />} />
            </>
          )}

          {user?.role === 'supervisor' && (
            <>
              <Route path="outward" element={<Outward />} />
              <Route path="report" element={<Report />} />
            </>
          )}

          {user?.role === 'user' && (
            <>
              <Route path="outward" element={<Outward />} />
              <Route path="services" element={<Services />} />
              <Route path="report" element={<Report />} />
            </>
          )}

          {/* ✅ fallback inside /app */}
          <Route path="*" element={<Navigate to="/app/outward" />} />
        </Route>

        {/* ✅ fallback for unknown base routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
