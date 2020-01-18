const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'subscriber',
        lowercase: true
    },
    verified: {
        type: Boolean,
        default: false,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };