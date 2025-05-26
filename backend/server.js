const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const stockRoutes = require('./routes/stock');
const inventoryRoutes = require('./routes/inventory');
const clientRoutes = require('./routes/clients');
const dashboardRoutes = require('./routes/dashboard');
const servicesRoutes = require('./routes/services');
const reportRoutes = require('./routes/report');
const userRoutes = require('./routes/users');
const db = require('./db');




app.use(cors());
app.use(bodyParser.json());
app.use(userRoutes);
app.use(reportRoutes);
app.use('/dashboard', dashboardRoutes);
app.use(servicesRoutes);
app.use(stockRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/clients', clientRoutes);



app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [results] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?',
      [username, password, role]
    );

    if (results.length === 0) return res.status(401).send('Invalid login');
    res.json(results[0]);
  } catch (err) {
    console.error('Login error:', err);
    res.sendStatus(500);
  }
});

app.listen(3001, () => {
  console.log('🚀 Server is running on port 3001');
});