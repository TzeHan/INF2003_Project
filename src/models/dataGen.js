const pool = require('./connection');

const generateData = async () => {
    const [rows] = await pool.query(
        'SELECT COUNT(*) AS count FROM type'
    );

    if (rows[0].count > 0) {
        console.log('Sample data already exists');
        return;
    }

    await pool.query(`
        INSERT INTO type (name)
        VALUES ('Customer'), ('Admin')
    `);

    await pool.query(`
        INSERT INTO language (name)
        VALUES ('English'), ('Tamil'), ('Malay'), ('Mandarin')
    `);

    await pool.query(`
        INSERT INTO genre (name, description)
        VALUES
        ('Action', 'Action movies'),
        ('Comedy', 'Comedy movies'),
        ('Drama', 'Drama movies'),
        ('Thriller', 'Thriller movies')
    `);

    await pool.query(`
        INSERT INTO cinema (name, location)
        VALUES
        ('Cinema One', 'Singapore'),
        ('Cinema Two', 'Singapore')
    `);

    await pool.query(`
        INSERT INTO seat_type (name, price)
        VALUES
        ('Standard', 12),
        ('Premium', 18)
    `);

    await pool.query(`
        INSERT INTO status (name)
        VALUES
        ('Available'),
        ('Booked'),
        ('Pending'),
        ('Confirmed'),
        ('Cancelled'),
        ('Paid'),
        ('Failed')
    `);

    await pool.query(`
        INSERT INTO payment_methods (name)
        VALUES
        ('Credit Card'),
        ('Debit Card'),
        ('PayNow')
    `);

    await pool.query(`
        INSERT INTO food_category (name)
        VALUES
        ('Popcorn'),
        ('Drinks'),
        ('Snacks')
    `);

    await pool.query(`
        INSERT INTO users
        (name, phone_num, email, password, date_of_birth, type_id)
        VALUES
        ('Test User', '91234567', 'test@example.com',
        'password123', '2000-05-10', 1)
    `);

    await pool.query(`
        INSERT INTO product (name)
        VALUES
        ('Test Movie'),
        ('Popcorn'),
        ('Coke')
    `);

    await pool.query(`
        INSERT INTO movie
        (product_id, title, description, duration,
        release_date, language_id, img)
        VALUES
        (1, 'Test Movie', 'Test movie description',
        '120 minutes', '2026-10-01', 1, NULL)
    `);

    await pool.query(`
        INSERT INTO movie_genre (genre_id, product_id)
        VALUES (1, 1)
    `);

    await pool.query(`
        INSERT INTO theater
        (cinema_id, name, location)
        VALUES
        (1, 'Hall 1', 'Level 1')
    `);

    await pool.query(`
        INSERT INTO screening
        (theater_id, product_id, show_time)
        VALUES
        (1, 1, '18:00:00')
    `);

    await pool.query(`
        INSERT INTO seat
        (col_num, theater_id, seat_type_id)
        VALUES
        (1, 1, 1),
        (2, 1, 1),
        (3, 1, 2)
    `);

    await pool.query(`
        INSERT INTO screening_seat
        (screening_id, seat_id, status_id)
        VALUES
        (1, 1, 1),
        (1, 2, 1),
        (1, 3, 1)
    `);

    await pool.query(`
        INSERT INTO food
        (product_id, name, description, price, category_id)
        VALUES
        (2, 'Popcorn', 'Regular popcorn', 6.50, 1),
        (3, 'Coke', 'Regular Coke', 3.50, 2)
    `);

    console.log('Sample data generated');
};

module.exports = generateData;