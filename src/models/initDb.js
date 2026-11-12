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
    CREATE TABLE IF NOT EXISTS hall (
      hall_id INT AUTO_INCREMENT PRIMARY KEY,
      hall_num INT NOT NULL
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS tier (
      tier_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL
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
    CREATE TABLE IF NOT EXISTS admin_profile (
      user_id INT PRIMARY KEY,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS booking (
      booking_id INT AUTO_INCREMENT PRIMARY KEY,
      booking_date DATE NOT NULL,
      booking_time TIME NOT NULL,
      status_id INT NOT NULL,
      user_id INT NOT NULL,
      FOREIGN KEY (status_id) REFERENCES status(status_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS movie (
      product_id INT PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      description VARCHAR(200) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      date DATE,
      language_id INT NOT NULL,
      img VARCHAR(255),
      time VARCHAR(50),
      price INT,
      hall_id INT,
      tier_id INT,
      FOREIGN KEY (product_id) REFERENCES product(product_id),
      FOREIGN KEY (language_id) REFERENCES language(language_id),
      FOREIGN KEY (hall_id) REFERENCES hall(hall_id),
      FOREIGN KEY (tier_id) REFERENCES tier(tier_id)
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
    CREATE TABLE IF NOT EXISTS seat (
      seat_id INT AUTO_INCREMENT PRIMARY KEY,
      row varchar(1) NOT NULL,
      col_num INT NOT NULL,
      seat_type_id INT NOT NULL,
      FOREIGN KEY (seat_type_id) REFERENCES seat_type(seat_type_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS screening (
      screening_id INT AUTO_INCREMENT PRIMARY KEY,
      seat_id INT NOT NULL,
      product_id INT NOT NULL,
      status_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (seat_id) REFERENCES seat(seat_id),
      FOREIGN KEY (product_id) REFERENCES movie(product_id),
      FOREIGN KEY (status_id) REFERENCES status(status_id)
    )
  `);

  // await pool.query(`
  //   CREATE TABLE IF NOT EXISTS ticket (
  //     ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  //     booking_id INT NOT NULL,
  //     price DECIMAL(10,2) NOT NULL,
  //     screening_seat_id INT NOT NULL,
  //     FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
  //     FOREIGN KEY (screening_seat_id) REFERENCES screening_seat(screening_seat_id)
  //   )
  // `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_date DATE NOT NULL,
      status_id INT NOT NULL,
      transaction_id VARCHAR(100),
      payment_method_id INT NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
      FOREIGN KEY (status_id) REFERENCES status(status_id),
      FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS food_category (
      category_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS food (
      product_id INT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(200),
      price DECIMAL(10,2) NOT NULL,
      category_id INT NOT NULL,
      img VARCHAR(200),  
      FOREIGN KEY (product_id) REFERENCES product(product_id),
      FOREIGN KEY (category_id) REFERENCES food_category(category_id)
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS cart (
      cart_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      qty INT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES food(product_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);

  console.log('Tables ready');
};

module.exports = createTables;