const jwt = require('jsonwebtoken');
const { process_request } = require("../helpers/process-request")

function auth(req, res, next) {

    process_request(async() => {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).send('Access Denied. No token provided!')

        const decoded = jwt.verify(token, process.env.jwtprivatekey);
        req.user = decoded;
        next();
    });



}

module.exports = auth;