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
        date, language_id, img,time,hall)
        VALUES
        (1, 'Test Movie', 'Test movie description',
        '120 minutes', '2026-10-01', 1, "avengers.jpg","1350","67")
    `);

    await pool.query(`
        INSERT INTO movie_genre (genre_id, product_id)
        VALUES (1, 1)
    `);

    // 🚨 REMOVED theater INSERT


    // 🚨 FIXED seat INSERT (matches your new initDb)
    await pool.query(`
        INSERT INTO seat (row, col_num, seat_type_id)
        VALUES 
        ('A', 1, 1), ('A', 2, 1), ('A', 3, 1), ('A', 4, 1), ('A', 5, 1), ('A', 6, 1), ('A', 7, 1), ('A', 8, 1), ('A', 9, 1), ('A', 10, 1),
        ('B', 1, 1), ('B', 2, 1), ('B', 3, 1), ('B', 4, 1), ('B', 5, 1), ('B', 6, 1), ('B', 7, 1), ('B', 8, 1), ('B', 9, 1), ('B', 10, 1),
        ('C', 1, 2), ('C', 2, 2), ('C', 3, 2), ('C', 4, 2), ('C', 5, 2), ('C', 6, 2), ('C', 7, 2), ('C', 8, 2), ('C', 9, 2), ('C', 10, 2),
        ('D', 1, 2), ('D', 2, 2), ('D', 3, 2), ('D', 4, 2), ('D', 5, 2), ('D', 6, 2), ('D', 7, 2), ('D', 8, 2), ('D', 9, 2), ('D', 10, 2)
    `);
    // 🚨 FIXED screening INSERT (matches your new initDb)
    // await pool.query(`
    //     INSERT INTO screening
    //     (seat_id, product_id)
    //     VALUES
    //     (1, 1)
    // `);
    await pool.query(`
        INSERT INTO screening (seat_id, product_id, status_id)
        VALUES 
        (1, 1, 2), (2, 1, 1), (3, 1, 1), (4, 1, 1), (5, 1, 1), (6, 1, 1), (7, 1, 1), (8, 1, 1), (9, 1, 1), (10, 1, 1),
        (11, 1, 1), (12, 1, 1), (13, 1, 1), (14, 1, 1), (15, 1, 1), (16, 1, 2), (17, 1, 1), (18, 1, 1), (19, 1, 1), (20, 1, 1),
        (21, 1, 1), (22, 1, 1), (23, 1, 1), (24, 1, 1), (25, 1, 1), (26, 1, 1), (27, 1, 1), (28, 1, 1), (29, 1, 1), (30, 1, 1),
        (31, 1, 1), (32, 1, 1), (33, 1, 1), (34, 1, 1), (35, 1, 1), (36, 1, 1), (37, 1, 2), (38, 1, 1), (39, 1, 1), (40, 1, 1)
    `);

    // 🚨 REMOVED screening_seat INSERT

    await pool.query(`
        INSERT INTO food
        (product_id, name, description, price, category_id, img)
        VALUES
        (2, 'Popcorn', 'Regular popcorn', 6.50, 1 , 'popcorn.jpg'),
        (3, 'Coke', 'Regular Coke', 3.50, 2, 'coke.jpg')
    `);

    console.log('Sample data generated');
};

module.exports = generateData;