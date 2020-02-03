const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userReg = require("../mailer/user-reg");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        alias: 'fullname', //the property can also be accessed using this name!
        trim: true,
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
        lowercase: true,
        enum: ['admin', 'editor', 'subscriber']
    },
    verified: {
        type: Boolean,
        default: false,
    },
    profile: {
        type: new mongoose.Schema({
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
        }),
        required: false
    }
});


userSchema.statics.lookup = function(email) {
    return this.findOne({ 'email': email });
};

userSchema.statics.confirmVerify = function(user) {
    return this.findOne({ 'email': user.email }).select('verified -_id');
};

userSchema.statics.login = async function(email, password) {

    const user = await this.findOne({ 'email': email });
    if (!user) return false;

    const match = await bcrypt.compare(password, user.password);

    if (match) return user;
    return false;

};

userSchema.statics.getId = function(email) {
    let user = this.findOne({ 'email': email }).select("_id");
    return user;
};


//Gets the full info of the user eg uchenna.getInfo
userSchema.virtual('getInfo').get(function() {
    return `Name: ${this.name} \n Email: ${this.email} \n Role: ${this.role}`;
});

//uchenna.setEmail = 'test@email.com'
userSchema.virtual('setEmail').set(function(email) {
    this.email = email;
});

userSchema.pre('save', async function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    //encrypt password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();

});

userSchema.post('save', async function(newUser, next) {
    var user = this;
    //  await userReg(newUser).catch(console.error)
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };