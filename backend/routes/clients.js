const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Client fetch failed' });
  }
});

router.post('/', async (req, res) => {
  const { client_name, address } = req.body;
  try {
    await db.execute('INSERT INTO clients (client_name, address) VALUES (?, ?)', 
      [client_name, address]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Client insert failed' });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 🔍 Check if client is in use in stock_transactions
    const [inUse] = await db.execute(
      'SELECT COUNT(*) AS count FROM stock_transactions WHERE client_id = ?',
      [id]
    );

    if (inUse[0].count > 0) {
      return res.status(400).json({ error: 'You cannot delete this client — it is in use.' });
    }

    // ✅ Safe to delete
    const [result] = await db.execute('DELETE FROM clients WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Client delete error:', err);
    res.status(500).json({ error: 'Server error while deleting client' });
  }
});




module.exports = router;
