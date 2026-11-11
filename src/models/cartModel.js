const pool = require('./connection');

exports.addToCart = async (cart_Details) => {
    const [result] = await pool.query(
        'INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)',
        [cart_Details.user_id, cart_Details.product_id,cart_Details.qty]
    );
    return result;
};

exports.getCartbyUserId = async (id) => {
    const [result] = await pool.query(
        'SELECT c.*,f.product_id,f.name,f.price,f.img FROM cart c join food f on c.product_id = f.product_id WHERE c.user_id = ?',
        [id]
    );
    return result;
};

exports.getCartbyId= async (id) => {
    const [result] = await pool.query(
        'SELECT * FROM cart WHERE cart_id = ?',
        [id]
    );
    return result[0];
};

exports.getDuplicatedFoodinCart = async (user_id,product_id) => {
    const [result] = await pool.query(
        'SELECT cart_id, qty FROM cart WHERE user_id = ? AND product_id = ?',
        [user_id,product_id]
    );
    return result[0];
};

exports.updateQty = async (cart_id,qty) => {
    const [result] = await pool.query(
        'UPDATE cart SET qty = ? WHERE cart_id = ?',
        [qty,cart_id]
    );
    return result;
};

exports.deleteFoodfromCart = async (cart_id) => {
    const [result] = await pool.query(
        'DELETE from cart WHERE cart_id = ?',
        [cart_id]
    );
    return result;
};