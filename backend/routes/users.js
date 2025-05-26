const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/users', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [results] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    await db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT id, username, role FROM users');
    res.json(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
