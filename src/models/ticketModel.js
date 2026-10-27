const pool = require('./connection');

exports.create = async (ticket) => {
    const [result] = await pool.query(
        `INSERT INTO ticket
        (booking_id, price, screening_seat_id)
        VALUES (?, ?, ?)`,
        [
            ticket.booking_id,
            ticket.price,
            ticket.screening_seat_id
        ]
    );
    return result;
};

exports.findById = async (ticketId) => {
    const [rows] = await pool.query(
        `SELECT * FROM ticket
        WHERE ticket_id = ?`,
        [ticketId]
    );
    return rows[0];
};

exports.findByBooking = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT t.ticket_id, t.booking_id, t.price,
                ss.screening_id, ss.seat_id,
                s.col_num,
                st.name AS seat_type
        FROM ticket t
        JOIN screening_seat ss
            ON t.screening_seat_id = ss.screening_seat_id
        JOIN seat s
            ON ss.seat_id = s.seat_id
        JOIN seat_type st
            ON s.seat_type_id = st.seat_type_id
        WHERE t.booking_id = ?`,
        [bookingId]
    );
    return rows;
};

exports.update = async (ticketId, ticket) => {
    const [result] = await pool.query(
        `UPDATE ticket
        SET booking_id = ?, price = ?, screening_seat_id = ?
        WHERE ticket_id = ?`,
        [
            ticket.booking_id,
            ticket.price,
            ticket.screening_seat_id,
            ticketId
        ]
    );
    return result;
};

exports.remove = async (ticketId) => {
    const [result] = await pool.query(
        `DELETE FROM ticket
        WHERE ticket_id = ?`,
        [ticketId]
    );
    return result;
};