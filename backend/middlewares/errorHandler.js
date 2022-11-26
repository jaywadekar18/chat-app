
const ErrorHandler = require('../service/errorHandlerService')
function errorHandler(err, req, res, next) {
    console.log('in errorhandler');
    console.log('err in handle', err)
    if (err instanceof ErrorHandler) {

        res.status(err.status).json({
            error: {
                message: err.message,
                status: err.status
            }
        })
    }
    else {
        res.status(500).json({
            error: {
                message: err.message,
                status: err.status
            }
        });
    }
}
const notFound = (req, res, next) => {
    return res.status(404).json({
        error:
        {
            message: `page not found! ${req.originalUrl}`,
            status: 404
        }

    });
}
module.exports = { errorHandler, notFound }