const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'contacts'
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;