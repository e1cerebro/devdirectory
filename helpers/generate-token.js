var jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const userSignature = {
        email: user.email,
        name: user.name,
        _id: user._id,
        role: user.role
    };

    const key = process.env.jwtprivatekey;
    return jwt.sign(userSignature, key);
}

const verifyToken = (token) => {
    decoded = jwt.verify(token, process.env.jwtprivatekey);
    return decoded;
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
};