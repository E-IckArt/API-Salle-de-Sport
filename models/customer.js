const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    subscriptions: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }, // Copie le Schema SubscriptionSchema
    ],
    level: { type: String, default: 'beginner' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Copie le Schema UserSchema
    slots: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }, // Copie le Schema SlotSchema
    ],
});

const Customer = new mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
