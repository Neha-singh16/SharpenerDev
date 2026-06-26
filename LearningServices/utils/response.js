const SendErrorResponse = (res,err)=> {
    let statusCode = err.statusCode;
    let msg = err.message;

    return res.status(statusCode).json({
        message: msg,
        status : false,
    })
}

module.exports = {
    SendErrorResponse,
}