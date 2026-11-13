const pool = require('./connection');

exports.create = async (screening) => {
    const [result] = await pool.query(
        'INSERT INTO screening (seat_id, product_id, status_id) VALUES (?, ?, ?)',
        [screening.seat_id, screening.product_id, screening.status_id]
    );
    return result;
};

exports.findById = async (screening) => {
    const [rows] = await pool.query(
        `SELECT s.*, m.title AS movie_title, st.name AS status_name
         FROM screening s
         JOIN movie m ON s.product_id = m.product_id
         JOIN status st ON s.status_id = st.status_id
         WHERE s.screening_id = ?`,
        [screening.id]
    );
    return rows[0];
};

exports.findByMovie = async (movie) => {
    const [rows] = await pool.query(
        `SELECT s.*, se.row, se.col_num, st.name AS status_name
         FROM screening s
         JOIN seat se ON s.seat_id = se.seat_id
         JOIN status st ON s.status_id = st.status_id
         WHERE s.product_id = ?`,
        [movie.productId]
    );
    return rows;
};

exports.update = async (screening) => {
    const [result] = await pool.query(
        'UPDATE screening SET seat_id = ?, product_id = ?, status_id = ? WHERE screening_id = ?',
        [screening.seat_id, screening.product_id, screening.status_id, screening.screeningId]
    );
    return result;
};

exports.remove = async (screening) => {
    const [result] = await pool.query(
        'DELETE FROM screening WHERE screening_id = ?',
        [screening.screeningId]
    );
    return result;
};