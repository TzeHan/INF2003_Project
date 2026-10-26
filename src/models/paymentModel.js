const pool = require('./connection');

exports.create = async (payment) => {
    const [result] = await pool.query(
        `INSERT INTO payment
        (booking_id, amount, payment_date, status_id, transaction_id, payment_method_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            payment.booking_id,
            payment.amount,
            payment.payment_date,
            payment.status_id,
            payment.transaction_id,
            payment.payment_method_id
        ]
    );
    return result;
};

exports.findById = async (paymentId) => {
    const [rows] = await pool.query(
        `SELECT * FROM payment
        WHERE payment_id = ?`,
        [paymentId]
    );
    return rows[0];
};

exports.findByBooking = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT p.payment_id, p.booking_id, p.amount,
                p.payment_date, p.transaction_id,
                s.name AS status,
                pm.name AS payment_method
        FROM payment p
        JOIN status s
            ON p.status_id = s.status_id
        JOIN payment_methods pm
            ON p.payment_method_id = pm.payment_method_id
        WHERE p.booking_id = ?`,
        [bookingId]
    );
    return rows;
};

exports.updateStatus = async (paymentId, statusId) => {
    const [result] = await pool.query(
        `UPDATE payment
        SET status_id = ?
        WHERE payment_id = ?`,
        [statusId, paymentId]
    );
    return result;
};

exports.getTotalRevenue = async () => {
    const [rows] = await pool.query(
        `SELECT SUM(amount) AS total_revenue
        FROM payment`
    );
    return rows[0];
};

exports.getPaymentCountByStatus = async () => {
    const [rows] = await pool.query(
        `SELECT s.name AS status,
                COUNT(p.payment_id) AS payment_count
        FROM payment p
        JOIN status s
            ON p.status_id = s.status_id
        GROUP BY s.status_id, s.name`
    );
    return rows;
};

exports.remove = async (paymentId) => {
    const [result] = await pool.query(
        `DELETE FROM payment
        WHERE payment_id = ?`,
        [paymentId]
    );
    return result;
};