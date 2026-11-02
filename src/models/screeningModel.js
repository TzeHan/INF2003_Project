const pool = require('./connection');

exports.create = async (screening) => {
    const [result] = await pool.query(
        'INSERT INTO screening (theater_id, product_id, show_time) VALUES (?, ?, ?)',
        [screening.theater_id, screening.product_id, screening.show_time]
    );
    return result;
};

exports.findById = async (screening) => {
    const [rows] = await pool.query(
        `SELECT s.*, t.name as theater_name, c.name as cinema_name, m.title as movie_title 
         FROM screening s
         JOIN theater t ON s.theater_id = t.theater_id
         JOIN cinema c ON t.cinema_id = c.cinema_id
         JOIN movie m ON s.product_id = m.product_id
         WHERE s.screening_id = ?`,
        [screening.id]
    );
    return rows[0];
};

exports.findByMovie = async (movie) => {
    const [rows] = await pool.query(
        `SELECT s.*, t.name as theater_name, c.name as cinema_name, c.location 
         FROM screening s
         JOIN theater t ON s.theater_id = t.theater_id
         JOIN cinema c ON t.cinema_id = c.cinema_id
         WHERE s.product_id = ?`,
        [movie.productId]
    );
    return rows;
};

exports.update = async ( screening) => {
    const [result] = await pool.query(
        'UPDATE screening SET theater_id = ?, product_id = ?, show_time = ? WHERE screening_id = ?',
        [screening.theater_id, screening.product_id, screening.show_time, screening.screeningId]
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