const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    discipline: { type: String, default: 'Multisport' },
    bio: { type: String, default: 'No bio for this coach' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Copie le Schema UserSchema
    slots: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }, // Copie le Schema SlotSchema
    ],
});

const Coach = new mongoose.model('Coach', CoachSchema);

module.exports = Coach;
