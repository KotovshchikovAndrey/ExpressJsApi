const { redirect } = require("express/lib/response"),
    ApiError = require("../error/ApiError"),
    UserServices = require('../services/userServices'),
    { validationResult } = require('express-validator')
    require('dotenv').config()


class UserController {
    
    async registration(req,res,next) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const errors_messages = []

            for(let e of errors.array()) {
                errors_messages.push(e.msg)
            }
            
            return res.status(400).json({ errors: errors_messages })
        }

        try {
            const {username,email,password,confirm_password} = req.body
            const UserService = new UserServices()
            const user = await UserService.registration(username,email,password,confirm_password)

            if (!user) {
                return next(ApiError.badRequest(UserService.errors))
            }

            const {access_token,refresh_token} = await UserService.generate_tokens(user)

            res.cookie('refresh_token',refresh_token,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
            return res.status(200).json({
                success:'Вы успешно зарегистрировались!',
                access_token:access_token,
                refresh_token:refresh_token,
                user: user
            })

        } catch(err) {
            return next(ApiError.internal('не удалось создать пользователя!'))
        }
    }

    async login(req,res,next) {
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            const errors_messages = []

            for(let e of errors.array()) {
                errors_messages.push(e.msg)
            }
            
            return res.status(400).json({ errors: errors_messages })
        }

        try {
            const {username,email,password,confirm_password} = req.body
            const UserService = new UserServices()
            const user = await UserService.login(username,email,password,confirm_password)

            if (!user) {
                return next(ApiError.badRequest(UserService.errors))
            } else {
                const {access_token,refresh_token} = await UserService.generate_tokens(user)

                res.cookie('refresh_token',refresh_token,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
                return res.status(200).json({
                    user: user,
                    access_token: access_token,
                    refresh_token: refresh_token
                })
            }

        } catch(err) {
            return next(ApiError.internal('не удалось получить пользователя!'))
        }
    }

    async update_tokens(req,res,next) {
        const old_refresh_token = req.cookies.refresh_token
        const old_access_token = req.headers.authorization

        if (!old_refresh_token || !old_access_token) {
            return next(ApiError.forbidden('Токен не найден!'))
        }

        try {
            const UserService = new UserServices()
            const {access_token, refresh_token} = await UserService.update_tokens(old_access_token,old_refresh_token)

            if (!access_token || !refresh_token) {
                return next(ApiError.forbidden(UserService.errors))
            } else {
                res.cookie('refresh_token',refresh_token,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
                return res.status(200).json({
                    access_token: access_token,
                    refresh_token: refresh_token
                })
            }

        } catch(err) {
            return next(ApiError.internal('не удалось обновить токен!'))
        }
    } 
    
    async logout(req,res,next) {
        try {
            const refresh_token = req.cookies.refresh_token
            if (refresh_token) {
                const UserService = new UserServices()
                const token = await UserService.logout(refresh_token)
                return res.status(200).json({
                    message: 'Вы успено вышли!'
                })
            }
            
            return res.status(204).json()

        } catch(err) {
            return next(ApiError.internal('не удалось выйти из системы!'))
        }       
    }
}


module.exports = new UserController()