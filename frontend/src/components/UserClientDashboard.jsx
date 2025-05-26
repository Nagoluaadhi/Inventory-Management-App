import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserClientDashboard() {
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/clients').then(res => setClients(res.data));
    axios.get('http://localhost:3001/dashboard/inventory').then(res => setInventory(res.data));
    axios.get('http://localhost:3001/dashboard/user-usage').then(res => setUsage(res.data));
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Summary</h2>

      <div>
        <h3 className="font-semibold text-lg mb-2">Client Balances</h3>
        <table className="w-full text-sm border">
          <thead><tr><th className="border px-2">Client</th><th className="border px-2">Qty</th></tr></thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={i}>
                <td className="border px-2">{c.client_name}</td>
                <td className="border px-2">{c.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Inventory Balances</h3>
        <table className="w-full text-sm border">
          <thead><tr><th className="border px-2">Item</th><th className="border px-2">Qty</th></tr></thead>
          <tbody>
            {inventory.map((i, j) => (
              <tr key={j}>
                <td className="border px-2">{i.item_name}</td>
                <td className="border px-2">{i.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">User Usage</h3>
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2">User</th>
              <th className="border px-2">Item</th>
              <th className="border px-2">Used Qty</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((u, k) => (
              <tr key={k}>
                <td className="border px-2">{u.username}</td>
                <td className="border px-2">{u.item_name}</td>
                <td className="border px-2">{u.total_used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
