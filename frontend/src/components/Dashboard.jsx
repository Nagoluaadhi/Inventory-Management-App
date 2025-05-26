import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    stockIn: 0,
    outward: 0,
    inventory: 0,
    perUser: [],
    perUserIn: [],
    perClient: []
  });

  const fetchStats = async () => {
    const res = await axios.get('http://localhost:3001/dashboard');
    setStats(res.data);
  };

  useEffect(() => {
    fetchStats();
  }, []);
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">📥 Total Stock In</h3>
          <p className="text-2xl text-green-600">{stats.stockIn}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">📤 Total Outward</h3>
          <p className="text-2xl text-red-500">{stats.stockOut}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700">📦 Inventory Items</h3>
          <p className="text-2xl text-blue-600">{stats.inventory}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Per User StockOut</h3>
      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">User</th>
            <th className="border px-2">Total Stock Out</th>
          </tr>
        </thead>
        <tbody>
          {stats.perUser.map((u, i) => (
            <tr key={i}>
              <td className="border px-2">{u.username}</td>
              <td className="border px-2">{u.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mb-2">Per User StockIn</h3>
<table className="w-full border text-sm mb-6">
  <thead className="bg-gray-100">
    <tr>
      <th className="border px-2">User</th>
      <th className="border px-2">Total Stock In</th>
    </tr>
  </thead>
  <tbody>
    {stats.perUserIn.map((u, i) => (
      <tr key={i}>
        <td className="border px-2">{u.username}</td>
        <td className="border px-2">{u.total}</td>
      </tr>
    ))}
  </tbody>
</table>


      <h3 className="text-lg font-semibold mb-2">Per Client Balance</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">Client</th>
            <th className="border px-2">Item</th>
            <th className="border px-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {stats.perClient.map((c, i) => (
            <tr key={i}>
              <td className="border px-2">{c.client_name}</td>
              <td className="border px-2">{c.item_name}</td>
              <td className="border px-2">{c.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
