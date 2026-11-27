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
            'INSERT INTO food (product_id, name, description, price, category_id, img) VALUES (?, ?, ?, ?, ?, ?)',
            [product_id, food.name, food.description, food.price, food.category_id, food.image]
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
        'SELECT * FROM food '
    );
    return rows;
};

exports.findAllCategory = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM food_category '
    );
    return rows;
};

exports.findFoodById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM food WHERE product_id = ?',
        [id]
    );
    return rows[0];
};

exports.findFoodByCategory = async (catId) => {
    const [rows] = await pool.query(
        'SELECT * FROM food WHERE category_id = (select category_id from food_category where category_id = ?)',
        [catId]
    );
    return rows;
};

exports.removeFood = async (food) => {  //because connected to stuff
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM food WHERE product_id = ?', [food.productId]);
        const [result] = await connection.query('DELETE FROM product WHERE product_id = ?', [food.productId]);

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.updateFood = async (food) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE product SET name = ? WHERE product_id = ?',
            [food.name, food.product_id]
        );

        await connection.query(
            'UPDATE food SET name = ?, description = ?, price = ?, category_id = ?, img = ? WHERE product_id = ?',
            [food.name, food.description, food.price, food.category_id, food.image, food.product_id]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.getFoodHistory = async (userId) => {
    const [history] = await pool.query(
        `SELECT 
            fo.order_date, 
            f.name, 
            SUM(foi.qty) AS quantity, 
            fo.total_cost AS price
        FROM food_order fo
        JOIN food_order_item foi ON fo.food_order_id = foi.food_order_id
        JOIN Food f ON foi.product_id = f.product_id
        WHERE fo.user_id = ?
        GROUP BY fo.food_order_id, fo.order_date, fo.order_time, f.name, fo.total_cost
        ORDER BY fo.order_date DESC, fo.order_time DESC`,
        [userId]
    );
    return history;
};

exports.checkoutCart = async (userId) => {
    const connection = await pool.getConnection();
    const now = new Date();
    const orderDate = now.toISOString().split('T')[0]; 
    const orderTime = now.toTimeString().split(' ')[0]; 

    try {
        await connection.beginTransaction();

        const [cartItems] = await connection.query(
            `SELECT c.product_id, c.qty, f.price 
             FROM Cart c 
             JOIN Food f ON c.product_id = f.product_id 
             WHERE c.user_id = ?`,
            [userId]
        );

        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        let totalCost = 0;
        for (const item of cartItems) {
            totalCost += (item.price * item.qty);
        }

        const [orderResult] = await connection.query(
            `INSERT INTO food_order (user_id, order_date, order_time, total_cost) 
             VALUES (?, ?, ?, ?)`,
            [userId, orderDate, orderTime, totalCost]
        );
        const orderId = orderResult.insertId;

        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO food_order_item (product_id, food_order_id, qty, price) 
                 VALUES (?, ?, ?, ?)`,
                [item.product_id, orderId, item.qty, item.price]
            );
        }

        await connection.query(
            `DELETE FROM Cart WHERE user_id = ?`,
            [userId]
        );

        await connection.commit();
        return { success: true, orderId: orderId };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};