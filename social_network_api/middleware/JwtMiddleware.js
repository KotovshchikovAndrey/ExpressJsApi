const jwt = require('jsonwebtoken'),
    {User} = require('../models/models'),
    ApiError = require('../error/ApiError')
    require('dotenv').config()


async function authenticate_credentials(id) {
    const user =  User.findOne({
        where: {
            id: id
        }
    })

    if (!user) {
        return false
    } 

    return true
}


module.exports = async function(req,res,next) {
    const token = req.headers.authorization

    if (!token) {
        return next(ApiError.forbidden('Токен не найден!'))
    } 

    try {
        const data = jwt.verify(token,process.env.SECRET_KEY)
        const user = await authenticate_credentials(data.id)

        if (!user) {
            return next(ApiError.forbidden('Пользватель с таким токеном не найден!'))
        }

    } catch(e) {
        return next(ApiError.forbidden('Токен не валиден!'))
    }

    next()
}