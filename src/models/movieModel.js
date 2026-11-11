const pool = require('./connection')

exports.findAll = async() => {
    const[rows] = await pool.query('SELECT * FROM movie');
    return rows;
};

exports.findSeats = async(id) => {
    const[rows] = await pool.query(`SELECT 
    s.*, sc.status_id, 
    st.name AS status_name,
    seat_t.name AS seat_type_name,
    seat_t.price AS seat_price
    FROM Seat s 
    JOIN Screening sc ON s.seat_id = sc.seat_id 
    JOIN movie m ON m.product_id = sc.product_id 
    JOIN status st ON sc.status_id = st.status_id
    JOIN seat_type seat_t ON s.seat_type_id = seat_t.seat_type_id
    WHERE m.product_id = ?
    ORDER BY s.col_num ASC`,[id]
    );
    return rows;
};

exports.findAvailableSeats = async(id) => {
    const[rows] = await pool.query('SELECT s.* from Seat s join Screening sc on s.seat_id = sc.seat_id join movie m on m.product_id = sc.product_id WHERE m.product_id = ?',
        [id]
    );
    return rows;
};

exports.findDistinctRow = async(id) => {
    const[rows] = await pool.query('SELECT DISTINCT s.row from Seat s join Screening sc on s.seat_id = sc.seat_id join movie m on m.product_id = sc.product_id WHERE m.product_id = ?',
        [id]
    );
    return rows;
};

exports.findById = async(id) => {
    const [rows] = await pool.query(
        'SELECT * FROM movie WHERE product_id = ?',
        [id]
    );
    return rows[0];
};

exports.create = async(movie) => {
    const [result] = await pool.query(
        `INSERT INTO movie 
        (product_id, title, description, duration, date, language_id, img,time,hall)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            movie.product_id,
            movie.title,
            movie.description,
            movie.duration,
            movie.release_date,
            movie.language_id,
            movie.img,
            movie.time,
            movie.hall
        ]
    );

    return result;
};

exports.update = async(movie) => {
    const [result] = await pool.query(
        `UPDATE movie
        SET title = ?, description = ?, duration = ?, date = ?, language_id = ?, img = ?, time= ?, hall=?
        WHERE movie.id = ?`,
        [
            movie.title,
            movie.description,
            movie.duration,
            movie.release_date,
            movie.language_id,
            movie.img,
            movie.time,
            movie.hall,
            movie.id
        ]
    );

    return result;
};

exports.remove = async(movie) => {
    const [result] = await pool.query(
        'DELETE FROM movie WHERE movie.id = ?',
        [movie.id]
    );

    return result;
};