const pool = require('./connection');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS type (
      type_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product (
      product_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL

    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS language (
      language_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS genre (
      genre_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(200)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cinema (
      cinema_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      location VARCHAR(50) NOT NULL

    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS seat_type (
      seat_type_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      price INT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS status (
      status_id INT AUTO_INCREMENT PRIMARY KEY,
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
    CREATE TABLE IF NOT EXISTS movie (
      product_id INT PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      description VARCHAR(200) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      release_date DATE,
      language_id INT NOT NULL,
      img VARCHAR(255),
      FOREIGN KEY (product_id) REFERENCES product(product_id),
      FOREIGN KEY (language_id) REFERENCES language(language_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS movie_genre (
      movie_genre_id INT AUTO_INCREMENT PRIMARY KEY,
      genre_id INT NOT NULL,
      product_id INT NOT NULL,
      FOREIGN KEY (genre_id) REFERENCES genre(genre_id),
      FOREIGN KEY (product_id) REFERENCES product(product_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS theater (
      theater_id INT AUTO_INCREMENT PRIMARY KEY,
      cinema_id INT NOT NULL,
      name VARCHAR(50) NOT NULL,
      location VARCHAR(50) NOT NULL,
      FOREIGN KEY (cinema_id) REFERENCES cinema(cinema_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS screening (
      screening_id INT AUTO_INCREMENT PRIMARY KEY,
      theater_id INT NOT NULL,
      product_id INT NOT NULL,
      show_time TIME,
      FOREIGN KEY (theater_id) REFERENCES theater(theater_id),
      FOREIGN KEY (product_id) REFERENCES product(product_id)

    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS seat (
      seat_id INT AUTO_INCREMENT PRIMARY KEY,
      col_num INT NOT NULL,
      theater_id INT NOT NULL,
      seat_type_id INT NOT NULL,
      FOREIGN KEY (theater_id) REFERENCES theater(theater_id),
      FOREIGN KEY (seat_type_id) REFERENCES seat_type(seat_type_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS screening_seat (
      screening_seat_id INT AUTO_INCREMENT PRIMARY KEY,
      screening_id INT NOT NULL,
      seat_id INT NOT NULL,
      status_id INT NOT NULL,
      FOREIGN KEY (screening_id) REFERENCES screening(screening_id),
      FOREIGN KEY (seat_id) REFERENCES seat(seat_id),
      FOREIGN KEY (status_id) REFERENCES status(status_id)

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