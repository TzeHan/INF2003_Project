const pool = require('./connection');

exports.create = async (booking) => {
    const [result] = await pool.query(
        `INSERT INTO booking
        (booking_date, booking_time, status_id, user_id, price)
        VALUES (?, ?, ?, ?, ?)`,
        [
            booking.booking_date,
            booking.booking_time,
            booking.status_id,
            booking.user_id,
            booking.price
        ]
    );
    return result;
};

exports.createBookingTransaction = async (booking) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [bookingResult] = await connection.query(
            `INSERT INTO booking
            (booking_date, booking_time, status_id, user_id, price)
            VALUES (?, ?, ?, ?, ?)`,
            [
                booking.booking_date,
                booking.booking_time,
                booking.status_id,
                booking.user_id,
                booking.price
            ]
        );

        const booking_id = bookingResult.insertId;

        const [ticketResult] = await connection.query(
            `INSERT INTO ticket
            (booking_id, screening_id, price)
            VALUES (?, ?, ?)`,
            [
                booking_id,
                booking.screening_id,
                booking.price
            ]
        );

        await connection.query(
            `UPDATE screening
            SET status_id = (
                SELECT status_id
                FROM status
                WHERE name = ?
            )
            WHERE screening_id = ?`,
            [
                'Booked',
                booking.screening_id
            ]
        );

        await connection.commit();

        return {
            booking_id,
            ticket_id: ticketResult.insertId
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.findById = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT * FROM booking
        WHERE booking_id = ?`,
        [bookingId]
    );
    return rows[0];
};

exports.findByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT b.booking_id, b.booking_date, b.booking_time,
                s.name AS status
        FROM booking b
        JOIN status s ON b.status_id = s.status_id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC, b.booking_time DESC`,
        [userId]
    );
    return rows;
};

exports.updateStatus = async (bookingId, statusId) => {
    const [result] = await pool.query(
        `UPDATE booking
        SET status_id = ?
        WHERE booking_id = ?`,
        [statusId, bookingId]
    );
    return result;
};

exports.remove = async (bookingId) => {
    const [result] = await pool.query(
        `DELETE FROM booking
        WHERE booking_id = ?`,
        [bookingId]
    );
    return result;
};