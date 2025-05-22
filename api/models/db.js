const mysql = require('mysql2/promise');  // Importando mysql2 con promesas

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Gevensoft',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
