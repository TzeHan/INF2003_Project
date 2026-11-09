const { connectToMongo } = require('./mongoConnection');

// 1. Create a review
exports.create = async (reviewData) => {
    const db = await connectToMongo();
    const result = await db.collection('reviews').insertOne(reviewData);
    return result;
};

// 2. Get all reviews for a movie
exports.findByMovieId = async (movieId) => {
    const db = await connectToMongo();
    const reviews = await db.collection('reviews')
        .find({ movie_id: movieId.toString() })
        .sort({ date: -1 })
        .toArray();
    return reviews;
};