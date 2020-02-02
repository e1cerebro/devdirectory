const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gender: {
        type: String,
        required: false,
        minlength: 4,
        maxlength: 8
    },
    country: {
        type: String,
        required: false,
    },
    age: {
        type: String,
        required: true,
    },
    stacks: {
        type: Array,
        required: true,
    },
    bio: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 1000
    }
});

profileSchema.statics.lookup = async function(user_id) {
    return this.findOne({ 'user': user_id }).populate('user', '-_id -password -__v').select('-_id -__v');
}

const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Profile };