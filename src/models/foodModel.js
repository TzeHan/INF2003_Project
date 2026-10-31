const pool = require('./connection');

exports.createCategory = async (category) => {
    const [result] = await pool.query(
        'INSERT INTO food_category (name) VALUES (?)',
        [category.name]
    );
    return result;
};

exports.createFood = async (food) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // parent?
        const [productResult] = await connection.query(
            'INSERT INTO product (name) VALUES (?)',
            [food.name]
        );
        const product_id = productResult.insertId;

        // child
        const [foodResult] = await connection.query(
            'INSERT INTO food (product_id, name, description, price, category_id) VALUES (?, ?, ?, ?, ?)',
            [product_id, food.name, food.description, food.price, food.category_id]
        );

        await connection.commit();
        return { product_id, ...foodResult };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.findAllFood = async () => {
    const [rows] = await pool.query(
        'SELECT f.*, fc.name as category_name FROM food f JOIN food_category fc ON f.category_id = fc.category_id '
    );
    return rows;
};

exports.findFoodById = async (productId) => {
    const [rows] = await pool.query(
        `SELECT f.*, fc.name as category_name 
         FROM food f
         JOIN food_category fc ON f.category_id = fc.category_id
         WHERE f.product_id = ?`,
        [productId]
    );
    return rows[0];
};

exports.removeFood = async (productId) => {  //because connected to stuff
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM food WHERE product_id = ?', [productId]);
        const [result] = await connection.query('DELETE FROM product WHERE product_id = ?', [productId]);

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};