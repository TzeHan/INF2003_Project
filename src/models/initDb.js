const pool = require('./connection');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE
    )
  `);
  console.log('Tables ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cinema (
      cinema_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      location VARCHAR(50) NOT NULL

    )
  `);
  console.log('cinema ready');
};

module.exports = createTables;