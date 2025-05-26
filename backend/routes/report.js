const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/report', async (req, res) => {
  const { type, client_id, from, to } = req.query;

  let sql = `
    SELECT s.*, c.client_name, i.item_name
    FROM stock_transactions s
    JOIN clients c ON s.client_id = c.id
    JOIN inventory i ON s.inventory_id = i.id
    WHERE 1=1
  `;
  const params = [];

  if (type) {
    sql += ' AND s.transaction_type = ?';
    params.push(type);
  }

  if (client_id) {
    sql += ' AND s.client_id = ?';
    params.push(client_id);
  }

  if (from) {
    sql += ' AND s.date >= ?';
    params.push(from);
  }

  if (to) {
    sql += ' AND s.date <= ?';
    params.push(to);
  }

  sql += ' ORDER BY s.id DESC';

  try {
    const [results] = await db.execute(sql, params);
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
