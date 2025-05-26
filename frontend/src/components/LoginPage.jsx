import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/login', {
        username,
        password,
        role
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);

      // Redirect based on role
      if (res.data.role === 'admin') {
        navigate('/app/dashboard');
      } else {
        navigate('/app/outward');
      }
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in to Dashboard</h2>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded mb-6"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="supervisor">Supervisor</option>
          <option value="user">User</option>
        </select>
        <button onClick={handleLogin} className="w-full bg-orange-500 text-white py-2 rounded">
          SIGN IN
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
