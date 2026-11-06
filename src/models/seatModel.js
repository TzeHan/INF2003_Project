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
        "SELECT sc.screening_id ,m.title AS movie_title,t.name AS theater_name,c.name AS cinema_name,sc.show_time, COUNT(ss.screening_seat_id) AS total_seats, SUM(CASE WHEN sat.name = 'Available' THEN 1 ELSE 0 END) AS available_seats FROM screening sc JOIN movie m ON sc.product_id = m.product_id JOIN theater t ON sc.theater_id = t.theater_id JOIN cinema c ON t.cinema_id = c.cinema_id JOIN screening_seat ss ON sc.screening_id = ss.screening_idJOIN status sat ON ss.status_id = sat.status_id WHERE sc.screening_id = ? GROUP BY sc.screening_id;",
        [screening.screeningId]
    );
    return rows;
};

exports.findByTheater = async (theater) => {
    const [rows] = await pool.query(
        "SELECT s.*, st.name as seat_type_name, st.price  FROM seat s  JOIN seat_type st ON s.seat_type_id = st.seat_type_id WHERE s.theater_id = ?",
        [theater.theaterId]
    );
    return rows;
};

exports.updateSeat = async (seat) => {
    const [result] = await pool.query(
        "UPDATE seat SET col_num = ?, theater_id = ?, seat_type_id = ? WHERE seat_id = ?",
        [seat.col_num, seat.theater_id, seat.seat_type_id, seat.seatId]
    );
    return result;
};

exports.removeSeat = async (seat) => {
    const [result] = await pool.query(
        "DELETE FROM seat WHERE seat_id = ?",
        [seat.seatId]
    );
    return result;
};