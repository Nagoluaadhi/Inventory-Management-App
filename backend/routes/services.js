const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/services', async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT s.*, c.client_name 
      FROM services s
      JOIN clients c ON s.client_id = c.id
      ORDER BY s.id DESC
    `);
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/services', async (req, res) => {
  const { client_id, vehicle_no, service_remark, charges, status, barcode, warranty_status, date_time } = req.body;
  try {
    await db.execute(`
      INSERT INTO services 
      (client_id, vehicle_no, service_remark, charges, status, barcode, warranty_status, date_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, vehicle_no, service_remark, charges, status, barcode, warranty_status, date_time]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
