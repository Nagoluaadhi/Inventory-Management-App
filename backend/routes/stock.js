const express = require('express');
const router = express.Router();
const db = require('../db');

// ========================== STOCK IN ==========================

router.get('/stockin', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT st.*, inv.item_name, cl.client_name
      FROM stock_transactions st
      JOIN inventory inv ON st.inventory_id = inv.id
      JOIN clients cl ON st.client_id = cl.id
      WHERE st.transaction_type = 'in'
      ORDER BY st.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch stock-in failed' });
  }
});

router.post('/stockin', async (req, res) => {
  const { user_id, date, inventory_id, client_id, barcode, invoice_no, qty, remark } = req.body;
  try {
    await db.execute(`
  INSERT INTO stock_transactions
  (transaction_type, user_id, date, inventory_id, client_id, barcode, invoice_no, qty, remark)
  VALUES ('in', ?, ?, ?, ?, ?, ?, ?, ?)
`, [user_id, date, inventory_id, client_id, barcode, invoice_no, qty, remark]);

    await db.execute(`UPDATE inventory SET qty = qty + ? WHERE id = ?`, [qty, inventory_id]);
    await db.execute(`UPDATE clients SET qty = qty + ? WHERE id = ?`, [qty, client_id]);

    res.json({ message: 'Stock In recorded and balances updated' });
  } catch (err) {
    res.status(500).json({ error: 'Stock In failed' });
  }
});

router.delete('/stockin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      'DELETE FROM stock_transactions WHERE id = ? AND transaction_type = "in"', [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Stock-in entry not found' });
    }
    res.json({ message: 'Stock-in entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete stock-in failed' });
  }
});

// ========================== STOCK OUT ==========================

router.get('/outward', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT st.*, inv.item_name, cl.client_name
      FROM stock_transactions st
      JOIN inventory inv ON st.inventory_id = inv.id
      JOIN clients cl ON st.client_id = cl.id
      WHERE st.transaction_type = 'out'
      ORDER BY st.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch stock-out failed' });
  }
});

router.post('/stockout', async (req, res) => {
  const { user_id, date, inventory_id, client_id, barcode, invoice_no, qty, remark } = req.body;

  console.log('📤 Outward request body:', req.body);

  // ✅ Server-side validation
  if (!user_id || !date || !inventory_id || !client_id || !barcode || !qty) {
    return res.status(400).json({
      error: 'Missing required fields. Ensure user_id, date, inventory_id, client_id, barcode, and qty are provided.'
    });
  }

  try {
    // Insert transaction
    await db.execute(`
      INSERT INTO stock_transactions
      (transaction_type, user_id, date, inventory_id, client_id, barcode, invoice_no, qty, remark)
      VALUES ('out', ?, ?, ?, ?, ?, ?, ?, ?)
    `, [user_id, date, inventory_id, client_id, barcode, invoice_no || '', qty, remark || '']);

    // Update balances
    await db.execute(`UPDATE inventory SET qty = qty - ? WHERE id = ?`, [qty, inventory_id]);
    await db.execute(`UPDATE clients SET qty = qty - ? WHERE id = ?`, [qty, client_id]);

    // Track user usage
    await db.execute(`
      INSERT INTO user_usage (user_id, client_id, inventory_id, qty)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)
    `, [user_id, client_id, inventory_id, qty]);

    res.json({ message: 'Stock Out recorded and balances updated' });
  } catch (err) {
    console.error('❌ Stock Out Error:', err);
    res.status(500).json({ error: 'Stock Out failed on the server. Check server logs for details.' });
  }
});


router.delete('/outward/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM stock_transactions WHERE id = ? AND transaction_type = "out"', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
