exports.process_request = function(callback) {
    try {
        callback()
    } catch (error) {
        return res.status(401).send(error.message);
    }
}

module.exports.asyncMiddleware = (hanlder) => {
    return async(req, res, next) => {
        try {
            await hanlder(req, res);
        } catch (ex) {
            next(ex)
        }
    }
}