const mongoose = require('mongoose');

const contactFeedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    }
},
    { timestamps: true }
);

const ContactFeedback = mongoose.model('ContactFeedback', contactFeedbackSchema);

module.exports = ContactFeedback;
