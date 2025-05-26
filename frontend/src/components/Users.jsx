import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Users() {
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await axios.get('http://localhost:3001/users');
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/users', form);
    setForm({ username: '', password: '', role: 'user' });
    loadUsers();
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">User Management</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="p-2 border rounded" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="p-2 border rounded" />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="p-2 border rounded">
          <option value="admin">Admin</option>
          <option value="supervisor">Supervisor</option>
          <option value="user">User</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-3">Add User</button>
      </form>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">S.No</th>
            <th className="border px-2">Username</th>
            <th className="border px-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td className="border px-2">{i + 1}</td>
              <td className="border px-2">{u.username}</td>
              <td className="border px-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
