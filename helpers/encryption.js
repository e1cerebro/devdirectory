const bcrypt = require('bcrypt');

const encrypt = async(password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

module.exports = {
    encrypt: encrypt
}