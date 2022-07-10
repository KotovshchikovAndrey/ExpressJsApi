const ChatService = require('../services/chatServices'),
    { validationResult } = require('express-validator'),
    ApiError = require('../error/ApiError')


class ChatController {

    async dialog(req,res,next) {
        try {
            const user_id = req.params.user_id
            const token = req.headers.authorization

            const dialog_room = await ChatService.get_dialog_room(user_id,token)

            return res.status(200).json({
                dialog_room: dialog_room
            })

        } catch(err) {
            return next(ApiError.internal('не удалось получить диалог группу!'))
        }
    }

    async create_group(req,res,next) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const errors_messages = []

            for(let e of errors.array()) {
                errors_messages.push(e.msg)
            }
            
            return res.status(400).json({ errors: errors_messages })
        }

        try {
            const {title,users} = req.body
            const token = req.headers.authorization

            const group = await ChatService.create_group(title,users,token)
            const json_data = {}
        
            for(let data in group.toJSON()) {
                console.log(data)
                if(data === 'id' || data === 'title' || data === 'createdAt') json_data[data] = group[data]
            }

            return res.status(200).json({
                group: json_data
            })
            
        } catch(err) {
            next(ApiError.internal('не удалось создать группу!'))
        }
    }

    async delete_from_group(req,res,next) {
        try {
            const group_id = req.params.group_id
            const user_delete = req.body.user_id

            const group = await ChatService.delete_user_from_group(group_id,user_delete)

            return res.json({
                group: group
            })

        } catch(err) {
            return next(ApiError.internal('не удалось выполнить операцию удаления из группы!'))
        }
    }
}


module.exports = new ChatController()