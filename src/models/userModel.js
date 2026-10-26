const pool = require('./connection')

exports.findAll = async() => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
};

exports.findById = async(userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE user_id = ?',
        [userId]
    );
    return rows[0];
};

exports.create = async(user) => {
    const [result] = await pool.query(
        `INSERT INTO users 
        (name, phone_num, email, password, date_of_birth, type_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            user.name,
            user.phone_num,
            user.email,
            user.password,
            user.date_of_birth,
            user.type_id
        ]
    );

    return result;
};

exports.update = async(userId, user) => {
    const [result] = await pool.query(
        `UPDATE users
        SET name = ?, phone_num = ?, email = ?, password = ?, date_of_birth = ?, type_id = ?
        WHERE user_id = ?`,
        [
            user.name,
            user.phone_num,
            user.email,
            user.password,
            user.date_of_birth,
            user.type_id,
            userId
        ]
    );

    return result;
};

exports.remove = async(userId) => {
    const [result] = await pool.query(
        'DELETE FROM users WHERE user_id = ?',
        [userId]
    );

    return result;
};