const pool = require('./connection');

exports.createSeatType = async (seatType) => {
    const [result] = await pool.query(
        'INSERT INTO seat_type (name, price) VALUES (?, ?)',
        [seatType.name, seatType.price]
    );
    return result;
};

exports.createSeat = async (seat) => {
    const [result] = await pool.query(
        'INSERT INTO seat (`row`, col_num, seat_type_id) VALUES (?, ?, ?)',
        [seat.row, seat.col_num, seat.seat_type_id]
    );
    return result;
};

exports.getAvailableSeats = async (movie) => {
    const [rows] = await pool.query(
        `SELECT s.*, st.name AS seat_type_name, st.price, sc.status_id
         FROM seat s
         JOIN seat_type st ON s.seat_type_id = st.seat_type_id
         JOIN screening sc ON s.seat_id = sc.seat_id
         JOIN status sta ON sc.status_id = sta.status_id
         WHERE sc.product_id = ? AND sta.name = 'Available'
         ORDER BY s.row, s.col_num`,
        [movie.productId]
    );
    return rows;
};

exports.findByMovie = async (movie) => {
    const [rows] = await pool.query(
        `SELECT s.*, st.name AS seat_type_name, st.price, sc.status_id
         FROM seat s
         JOIN seat_type st ON s.seat_type_id = st.seat_type_id
         JOIN screening sc ON s.seat_id = sc.seat_id
         WHERE sc.product_id = ?
         ORDER BY s.row, s.col_num`,
        [movie.productId]
    );
    return rows;
};

exports.updateSeat = async (seat) => {
    const [result] = await pool.query(
        'UPDATE seat SET `row` = ?, col_num = ?, seat_type_id = ? WHERE seat_id = ?',
        [seat.row, seat.col_num, seat.seat_type_id, seat.seatId]
    );
    return result;
};

exports.removeSeat = async (seat) => {
    const [result] = await pool.query(
        'DELETE FROM seat WHERE seat_id = ?',
        [seat.seatId]
    );
    return result;
};