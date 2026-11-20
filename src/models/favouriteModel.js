const { connectToMongo } = require('./mongoConnection');

exports.create = async (favouriteData) => {
    const db = await connectToMongo();
    const result = await db.collection('favourites').insertOne({
        user_id: favouriteData.user_id,
        product_id: favouriteData.product_id,
        date: new Date()
    });
    return result;
};

exports.findByUserId = async (userId) => {
    const db = await connectToMongo();
    const favourites = await db.collection('favourites')
        .find({ user_id: userId })
        .sort({ date: -1 })
        .toArray();
    return favourites;
};

exports.findByUserAndMovie = async (userId, productId) => {
    const db = await connectToMongo();
    return await db.collection('favourites').findOne({
        user_id: userId,
        product_id: productId
    });
};

exports.remove = async (userId, productId) => {
    const db = await connectToMongo();
    const result = await db.collection('favourites').deleteOne({
        user_id: userId,
        product_id: productId
    });
    return result;
};