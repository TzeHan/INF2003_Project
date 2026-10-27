const pool = require('./connection')

exports.findAll = async() => {
    const[rows] = await pool.query('SELECT * FROM movie');
    return rows;
};

exports.findById = async(productId) => {
    const [rows] = await pool.query(
        'SELECT * FROM movie WHERE product_id = ?',
        [productId]
    );
    return rows[0];
};

exports.create = async(movie) => {
    const [result] = await pool.query(
        `INSERT INTO movie 
        (product_id, title, description, duration, release_date, language_id, img)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            movie.product_id,
            movie.title,
            movie.description,
            movie.duration,
            movie.release_date,
            movie.language_id,
            movie.img
        ]
    );

    return result;
};

exports.update = async(productId, movie) => {
    const [result] = await pool.query(
        `UPDATE movie
        SET title = ?, description = ?, duration = ?, release_date = ?, language_id = ?, img = ?
        WHERE product_id = ?`,
        [
            movie.title,
            movie.description,
            movie.duration,
            movie.release_date,
            movie.language_id,
            movie.img,
            productId
        ]
    );

    return result;
};

exports.remove = async(productId) => {
    const [result] = await pool.query(
        'DELETE FROM movie WHERE product_id = ?',
        [productId]
    );

    return result;
};