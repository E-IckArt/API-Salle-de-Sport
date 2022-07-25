const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    startHour: { type: String, required: true },
    endHour: { type: String, required: true },
    label: { type: String, required: true },
    peopleLimit: { type: Number, default: 5, required: true },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
    },
    customers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
        },
    ],
});

const Slot = new mongoose.model('Slot', SlotSchema);

module.exports = Slot;
