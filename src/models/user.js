const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    ssn: {
        type: String
    },
    tests: [{
        category: {
            type: String
        },
        score: {
            type: Number
        },
        date: {
            type: Date,
            default: Date.now()
        },
        questions: [{
            question: {
                type: String
            },
            answer: {
                type: String
            }
        }]
    }]
}, {
    timestamps: true,
    collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;