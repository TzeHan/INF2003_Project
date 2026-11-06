const pool = require('./connection');

exports.create = async (theater) => {
    const [result] = await pool.query(
        'INSERT INTO theater (cinema_id, name, location) VALUES (?, ?, ?)',
        [theater.cinema_id, theater.name, theater.location]
    );
    return result;
};

exports.findById = async (theater) => {
    const [rows] = await pool.query(
        'SELECT t.*, c.name AS cinema_name FROM theater t JOIN cinema c ON t.cinema_id = c.cinema_id WHERE t.theater_id = ?',
        [theater.theaterId]
    );
    return rows[0];
};

exports.findByCinema = async (cinema) => {
    const [rows] = await pool.query(
        'SELECT * FROM theater WHERE cinema_id = ?',
        [cinema.cinemaId]
    );
    return rows;
};

exports.update = async (theater) => {
    const [result] = await pool.query(
        'UPDATE theater SET cinema_id = ?, name = ?, location = ? WHERE theater_id = ?',
        [theater.cinema_id, theater.name, theater.location, theater.theaterId]
    );
    return result;
};

exports.remove = async (theater) => {
    const [result] = await pool.query(
        'DELETE FROM theater WHERE theater_id = ?',
        [theater.theaterId]
    );
    return result;
};