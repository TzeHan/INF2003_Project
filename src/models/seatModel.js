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
        'INSERT INTO seat (col_num, theater_id, seat_type_id) VALUES (?, ?, ?)',
        [seat.col_num, seat.theater_id, seat.seat_type_id]
    );
    return result;
};

exports.getAvailableSeats = async (screening) => {
    const [rows] = await pool.query(
        "SELECT ss.screening_seat_id, ss.screening_id, s.seat_id, s.col_num, s.theater_id, st.name AS seat_type_name, st.price, sat.name AS status_name FROM screening_seat ss JOIN seat s ON ss.seat_id = s.seat_id JOIN seat_type st ON s.seat_type_id = st.seat_type_id JOIN status sat ON ss.status_id = sat.status_id WHERE ss.screening_id = ? AND sat.name = 'Available' ",
        [screening.screeningId]
    );
    return rows;
};

exports.findByTheater = async (theater) => {
    const [rows] = await pool.query(
        'SELECT s.*, st.name as seat_type_name, st.price  FROM seat s  JOIN seat_type st ON s.seat_type_id = st.seat_type_id , WHERE s.theater_id = ?',
        [theater.theaterId]
    );
    return rows;
};

exports.updateSeat = async (seat) => {
    const [result] = await pool.query(
        'UPDATE seat SET col_num = ?, theater_id = ?, seat_type_id = ? WHERE seat_id = ?',
        [seat.col_num, seat.theater_id, seat.seat_type_id, seat.seatId]
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