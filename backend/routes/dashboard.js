const express = require('express');
const router = express.Router();
const db = require('../db');

// Inventory balance by ID
router.get('/inventory/:id', (req, res) => {
  db.query('SELECT qty FROM inventory WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error fetching inventory' });
    res.json(result[0]);
  });
});

// Client balance by ID
router.get('/clients/:id', (req, res) => {
  db.query('SELECT qty FROM clients WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error fetching client' });
    res.json(result[0]);
  });
});

// User usage balance
router.get('/usage', (req, res) => {
  const { user_id, client_id, inventory_id } = req.query;
  db.query(
    'SELECT qty FROM user_usage WHERE user_id = ? AND client_id = ? AND inventory_id = ?',
    [user_id, client_id, inventory_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error fetching usage' });
      res.json(result[0] || { qty: 0 });
    }
  );
});
// Main dashboard summary

router.get('/', async (req, res) => {
  try {
    const [stockIn] = await db.execute(
      `SELECT COUNT(*) AS total FROM stock_transactions WHERE transaction_type = 'in'`
    );

    const [stockOut] = await db.execute(
      `SELECT COUNT(*) AS total FROM stock_transactions WHERE transaction_type = 'out'`
    );

    const [inventory] = await db.execute(`SELECT COUNT(*) AS total FROM inventory`);

    const [perUser] = await db.execute(`
      SELECT u.username, SUM(s.qty) AS total
      FROM stock_transactions s
      JOIN users u ON s.user_id = u.id
      WHERE s.transaction_type = 'out'
      GROUP BY s.user_id
    `);

    const [perClient] = await db.execute(`
  SELECT 
    c.client_name,
    i.item_name,
    SUM(
      CASE WHEN s.transaction_type = 'in' THEN s.qty
           WHEN s.transaction_type = 'out' THEN -s.qty
           ELSE 0
      END
    ) AS balance
  FROM stock_transactions s
  JOIN clients c ON s.client_id = c.id
  JOIN inventory i ON s.inventory_id = i.id
  GROUP BY c.client_name, i.item_name
  HAVING balance > 0
`);
const [perUserIn] = await db.execute(`
  SELECT u.username, SUM(s.qty) AS total
  FROM stock_transactions s
  JOIN users u ON s.user_id = u.id
  WHERE s.transaction_type = 'in'
  GROUP BY s.user_id
`);



    res.json({
      stockIn: stockIn[0].total,
      stockOut: stockOut[0].total,
      inventory: inventory[0].total,
      perUser,
      perUserIn,
      perClient
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).json({ error: 'Dashboard load failed' });
  }
});




module.exports = router;
