const { ChatRoom,User,Message } = require('../models/models'),
    jwt = require('jsonwebtoken')
    require('dotenv').config()


class ChatServices {

    async get_dialog_room(user_id,token) {
        const user_data = jwt.verify(token,process.env.SECRET_KEY)

        let dialog_room = await ChatRoom.findOne({
            where: {
               type: 'Dialog',
            },
            attributes: ['id','type'],
            include: [{
                model: User,
                where: {
                   id: [user_id,user_data.id]
                },
                attributes: ['username','email'],
                through: {
                    attributes: []
                }
            },
            {
               model: Message,
               attributes: ['text','createdAt']
            }]
        })

        if(!dialog_room) {
            const user_first = await User.findByPk(user_id)
            const user_second = await User.findByPk(user_data.id)

            dialog_room = await ChatRoom.create({})
            await dialog_room.addUser(user_first,user_second)
        }

        return dialog_room
    }

    async create_group(title,users,token) {
        const user_data = jwt.verify(token,process.env.SECRET_KEY)
        const group = await ChatRoom.create({
            title: title,
            type: 'Group'
        })

        const group_creater = await User.findByPk(user_data.id)
        group.addUser(group_creater)

        if (users) {
            for (let user_id of users) {
                let group_member = await User.findOne({
                    where: {
                        id: user_id
                    }
                }) 

                if (group_member) {
                    group.addUser(group_member)
                }
            }
        }

        return group
    }

    async delete_user_from_group(group_id,user_id) {
        const group = await ChatRoom.findByPk(group_id)
        const users_in_group = await group.getUsers()

        for(let user of users_in_group) {
            if(user.id === user_id) user.userchatroom.destroy()
        }

        const update_group = await ChatRoom.findOne({
            where: {
                id: group_id
            },
            attributes: ['id','title','createdAt'],
            include: [{
                model: User,
                attributes: ['username','email'],
                through: {
                    attributes: []
                }
            },
            {
               model: Message,
               attributes: ['text','createdAt']
            }]
        })

        return update_group
    }
}


module.exports = new ChatServices()