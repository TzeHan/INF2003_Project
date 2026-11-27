const pool = require('./connection')

exports.findAll = async() => {
    const[rows] = await pool.query('SELECT * FROM movie');
    return rows;
};

exports.findSeats = async(id) => {
    const[rows] = await pool.query(`SELECT 
    s.*, sc.status_id, sc.screening_id,
    st.name AS status_name,
    seat_t.name AS seat_type_name,
    seat_t.price AS seat_price
    FROM Seat s 
    JOIN Screening sc ON s.seat_id = sc.seat_id 
    JOIN movie m ON m.product_id = sc.product_id 
    JOIN status st ON sc.status_id = st.status_id
    JOIN seat_type seat_t ON s.seat_type_id = seat_t.seat_type_id
    WHERE m.product_id = ?
    ORDER BY s.col_num ASC`,[id]
    );
    return rows;
};

exports.findAvailableSeats = async(id) => {
    const[rows] = await pool.query(
        'SELECT s.* from Seat s join Screening sc on s.seat_id = sc.seat_id join movie m on m.product_id = sc.product_id WHERE m.product_id = ?',
        [id]
    );
    return rows;
};

exports.findDistinctRow = async(id) => {
    const[rows] = await pool.query(
        'SELECT DISTINCT s.row from Seat s join Screening sc on s.seat_id = sc.seat_id join movie m on m.product_id = sc.product_id WHERE m.product_id = ?',
        [id]
    );
    return rows;
};

exports.findAllLanguages = async() => {
    const[rows] = await pool.query('SELECT * FROM language');
    return rows;
};

exports.findAllHall = async() => {
    const[rows] = await pool.query('SELECT * FROM hall');
    return rows;
};

exports.findAllTier = async() => {
    const[rows] = await pool.query('SELECT * FROM tier');
    return rows;
};

exports.findById = async(id) => {
    const [rows] = await pool.query(
        `SELECT m.*, h.hall_num, t.name AS tier_name
         FROM movie m
         JOIN hall h ON m.hall_id = h.hall_id
         JOIN tier t ON m.tier_id = t.tier_id
         WHERE m.product_id = ?`,
        [id]
    );
    return rows[0];
};

exports.getWatchHistory = async (userId) => {
        const [history] = await pool.query(
            `SELECT 
                b.booking_date, 
                m.title, 
                COUNT(t.ticket_id) AS quantity, 
                b.price
            FROM booking b
            JOIN ticket t ON b.booking_id = t.booking_id
            JOIN screening s ON t.screening_id = s.screening_id
            JOIN movie m ON s.product_id = m.product_id
            WHERE b.user_id = ?
            GROUP BY b.booking_id, b.booking_date, m.title, b.price
            ORDER BY b.booking_date DESC, b.booking_time DESC`,
            [userId]
        );
        return history;
};

exports.create = async(movie) => {
    const [result] = await pool.query(
        `INSERT INTO movie 
        (product_id, title, description, duration, date, language_id, img, time, price, hall_id, tier_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            movie.product_id,
            movie.title,
            movie.description,
            movie.duration,
            movie.date,
            movie.language_id,
            movie.img,
            movie.time,
            movie.price,
            movie.hall_id,
            movie.tier_id
        ]
    );

    return result;
};

exports.update = async(movie) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE product SET name = ? WHERE product_id = ?',
            [
                movie.title,
                movie.product_id
            ]
        );

        await connection.query(
            `UPDATE movie
             SET title = ?, description = ?, duration = ?, date = ?, 
                 language_id = ?, img = ?, time = ?, price = ?, 
                 hall_id = ?, tier_id = ?
             WHERE product_id = ?`,
            [
                movie.title,
                movie.description,
                movie.duration,
                movie.date,
                movie.language_id,
                movie.img,
                movie.time,
                movie.price,
                movie.hall_id,
                movie.tier_id,
                movie.product_id
            ]
        );

        await connection.commit();

        return { success: true };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.remove = async(movie) => {
    const [result] = await pool.query(
        'DELETE FROM movie WHERE product_id = ?',
        [movie.product_id]
    );

    return result;
};


exports.purchaseTix = async(tix) => {
    const connection = await pool.getConnection();
    const now = new Date();

    try {
        await connection.beginTransaction();
        const bookingDate = now.toISOString().split('T')[0]; 
        const bookingTime = now.toTimeString().split(' ')[0]; 

        await connection.query(
            `INSERT INTO booking(booking_date, status_id, booking_time, user_id, price) 
            VALUES (?, (SELECT status_id FROM status WHERE name = ?), ?, ?, (SELECT price FROM movie WHERE product_id = ?) * ?)`,
            [
                bookingDate, 
                'Booked',
                bookingTime,
                tix.user_id,
                tix.product_id,
                tix.qty
            ]
        );

        const [bookingRows] = await connection.query(
            'SELECT booking_id FROM booking WHERE user_id = ? ORDER BY booking_id DESC LIMIT 1',
            [tix.user_id]
        );
        const bookingId = bookingRows[0].booking_id;

        for (const screeningId of tix.selectedSeats) {
            await connection.query(
                `INSERT INTO ticket (booking_id, screening_id, price) 
                VALUES (?, ?, (SELECT price FROM movie WHERE product_id = ?))`,
                [
                    bookingId, 
                    Number(screeningId),
                    tix.product_id
                ]
            );

            await connection.query(
                `UPDATE Screening 
                 SET status_id = (SELECT status_id FROM status WHERE name = 'Booked') 
                 WHERE screening_id = ?`,
                [Number(screeningId)]
            );
        }

        await connection.commit();
        return { success: true };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};