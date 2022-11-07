const ErrorHandler = require("../service/errorHandlerService")
const JwtService = require('../service/jwtService')
const User = require('../models/userModel')
async function auth(req, res, next) {

    try {
        if (!req.headers.Authorization) {
            next(ErrorHandler.unAuthorized())
        }
        let token = req.headers.authorization.split(' ')[1];
        
        let { _id } = JwtService.verify(token);
        const user = await User.findOne({ _id });
        if (!user) {
            next(ErrorHandler.unAuthorized('not such user found!!'))
        }
        next()
    }
    catch (err) {
        next(ErrorHandler.serverError())
    }
}


module.exports = auth