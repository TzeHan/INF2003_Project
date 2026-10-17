const pool = require('./connection')

exports.findAll = async() => {
    const[rows] = await pool.query('SELECT * FROM users');
    return rows;
};