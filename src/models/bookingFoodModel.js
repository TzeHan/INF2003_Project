const pool = require('./connection');

exports.add = async (bookingFood) => {
    const [result] = await pool.query(
        `INSERT INTO booking_food
        (booking_id, product_id, qty, price)
        VALUES (?, ?, ?, ?)`,
        [
            bookingFood.booking_id,
            bookingFood.product_id,
            bookingFood.qty,
            bookingFood.price
        ]
    );
    return result;
};

exports.findByBooking = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT bf.booking_id, bf.product_id, bf.qty, bf.price,
                f.name AS food_name,
                fc.name AS category
        FROM booking_food bf
        JOIN food f
            ON bf.product_id = f.product_id
        JOIN food_category fc
            ON f.category_id = fc.category_id
        WHERE bf.booking_id = ?`,
        [bookingId]
    );
    return rows;
};

exports.updateQuantity = async (bookingId, productId, qty) => {
    const [result] = await pool.query(
        `UPDATE booking_food
        SET qty = ?
        WHERE booking_id = ? AND product_id = ?`,
        [qty, bookingId, productId]
    );
    return result;
};

exports.getTotal = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT SUM(qty * price) AS food_total
        FROM booking_food
        WHERE booking_id = ?`,
        [bookingId]
    );
    return rows[0];
};

exports.remove = async (bookingId, productId) => {
    const [result] = await pool.query(
        `DELETE FROM booking_food
        WHERE booking_id = ? AND product_id = ?`,
        [bookingId, productId]
    );
    return result;
};