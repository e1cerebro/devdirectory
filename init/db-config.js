const mongoose = require('mongoose');
const config = require('config');

module.exports = async function() {

    try {
        const db = config.get("db");
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
        console.log(error);
    }

    mongoose.connection.on('error', err => {
        console.log(err);
    });

}