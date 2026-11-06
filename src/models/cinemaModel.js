const pool = require('./connection');

exports.create = async (cinema) => {
    const [result] = await pool.query(
        'INSERT INTO cinema (name, location) VALUES (?, ?)',
        [cinema.name, cinema.location]
    );
    return result;
};

exports.findById = async (cinema) => {
    const [rows] = await pool.query(
        'SELECT * FROM cinema WHERE cinema_id = ?',
        [cinema.cinemaId]
    );
    return rows[0];
};

exports.findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM cinema');
    return rows;
};

exports.update = async (cinema) => {
    const [result] = await pool.query(
        'UPDATE cinema SET name = ?, location = ? WHERE cinema_id = ?',
        [cinema.name, cinema.location, cinema.cinemaId]
    );
    return result;
};

exports.remove = async (cinema) => {
    const [result] = await pool.query(
        'DELETE FROM cinema WHERE cinema_id = ?',
        [cinema.cinemaId]
    );
    return result;
};