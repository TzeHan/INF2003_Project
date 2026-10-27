const pool = require('./connection');

exports.create = async (cinema) => {
    const [result] = await pool.query(
        'INSERT INTO cinema (name, location) VALUES (?, ?)',
        [cinema.name, cinema.location]
    );
    return result;
};

exports.findById = async (cinemaId) => {
    const [rows] = await pool.query(
        'SELECT * FROM cinema WHERE cinema_id = ?',
        [cinemaId]
    );
    return rows[0];
};

exports.findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM cinema');
    return rows;
};

exports.update = async (cinemaId, cinema) => {
    const [result] = await pool.query(
        'UPDATE cinema SET name = ?, location = ? WHERE cinema_id = ?',
        [cinema.name, cinema.location, cinemaId]
    );
    return result;
};

exports.remove = async (cinemaId) => {
    const [result] = await pool.query(
        'DELETE FROM cinema WHERE cinema_id = ?',
        [cinemaId]
    );
    return result;
};