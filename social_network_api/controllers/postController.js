const { json } = require('express/lib/response')
const ApiError = require('../error/ApiError'),
    PostService = require('../services/postServices'),
    jwt = require('jsonwebtoken'),
    { validationResult } = require('express-validator')
    require('dotenv').config()
    

class PostController {

    async all_posts(req,res,next) {
        try {
            const posts = await PostService.get_all_posts(req.params.page,req.params.limit)
            return res.status(200).json({
                posts:posts
            })

        } catch(err) {
            return next(ApiError.internal('не удалось получить посты!'))
        }
    }

    async create_post(req,res,next) {
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            const errors_messages = []

            for(let e of errors.array()) {
                errors_messages.push(e.msg)
            }
            
            return res.status(400).json({ errors: errors_messages })
        }
        
        try {
            const {title,text,cat} = req.body
            const files = req.files
            const token = req.headers.authorization

            const user_id = jwt.verify(token,process.env.SECRET_KEY).id
            const post = await PostService.create_post(title,text,cat,user_id,files)
            
            return res.status(200).json({
                success: 'Пост Создан!',
                post: post
            })

        } catch(err) {
            console.log(err)
            return next(ApiError.internal('не удалось создать пост!'))
        }
    }

    async detail_post(req,res,next) {
        try {
            const post = await PostService.detail_post(req.params.id)

            return res.status(200).json({
                post: post
            })

        } catch(err) {
            return next(ApiError.internal('не удалось получить пост!'))
        }
    }

    async update_post(req,res,next) {
        try {
            const data = req.body

            if (!data) {
                return next(ApiError.badRequest('Данные не получены!'))
            }

            await PostService.update_post(req.params.id,data)

            return res.status(204).json()

        } catch(err) {
            return next(ApiError.internal('не удалось обновить пост!'))
        }
    }

    async delete_post(req,res,next) {
        try {
            await PostService.delete_post(req.params.id)

            return res.status(204).json()

        } catch(err) {
            return next(ApiError.internal('не удалось удалить пост!'))
        }
    }
}

module.exports = new PostController()