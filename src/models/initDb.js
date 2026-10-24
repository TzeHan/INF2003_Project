const pool = require('./connection');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS type (
      type_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      phone_num VARCHAR(20),
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      date_of_birth DATE,
      type_id INT,
      FOREIGN KEY (type_id) REFERENCES type(type_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS food_category (
      category_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  console.log('Tables ready');
};

module.exports = createTables;