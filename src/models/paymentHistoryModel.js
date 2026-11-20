const { connectToMongo } = require('./mongoConnection');

exports.create = async (paymentData) => {
    const db = await connectToMongo();
    const result = await db.collection('payment_history').insertOne({
        user_id: paymentData.user_id,
        reference_id: paymentData.reference_id,
        payment_type: paymentData.payment_type,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        status: paymentData.status,
        payment_date: new Date()
    });
    return result;
};

exports.findByUserId = async (userId) => {
    const db = await connectToMongo();
    const payments = await db.collection('payment_history')
        .find({ user_id: userId })
        .sort({ payment_date: -1 })
        .toArray();
    return payments;
};

exports.findByReferenceId = async (referenceId, paymentType) => {
    const db = await connectToMongo();
    return await db.collection('payment_history').findOne({
        reference_id: referenceId,
        payment_type: paymentType
    });
};