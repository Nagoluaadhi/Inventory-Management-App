const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET all inventory
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM inventory');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Inventory fetch failed' });
  }
});

// ✅ POST new inventory item
router.post('/', async (req, res) => {
  const { item_name, model_no, remark } = req.body;
  try {
    await db.execute(
      'INSERT INTO inventory (item_name, model_no, remark) VALUES (?, ?, ?)',
      [item_name, model_no, remark]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Inventory insert failed' });
  }
});

// ✅ DELETE an inventory item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Check if inventory is in use
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS count FROM stock_transactions WHERE inventory_id = ?', [id]
    );

    if (rows[0].count > 0) {
      return res.status(400).json({
        error: 'This inventory item is in use and cannot be deleted.',
      });
    }

    // Step 2: Safe to delete
    await db.execute('DELETE FROM inventory WHERE id = ?', [id]);
    res.json({ message: 'Inventory deleted successfully' });

  } catch (err) {
    console.error('Delete inventory failed:', err);
    res.status(500).json({ error: 'Delete inventory failed' });
  }
});



module.exports = router;
