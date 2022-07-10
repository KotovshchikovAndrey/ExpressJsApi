const { Message,User,ChatRoom } = require('../models/models')


async function chat_message(msg,user_id,room_id) {
    const message = await Message.create({
        text: msg,
        userId: user_id,
        chatroomId: room_id
    })

    return message
}

module.exports = function(io) {
    chat = io.of('/chat')

    chat.on('connection', function(socket) {
        const room_id = socket.handshake.query.room_id
        const room_name = `room_${room_id}`
        socket.join(room_name)
        
        socket.on('message', async function(data){
            try {
                const message = await chat_message(data.msg,data.user_id,room_id)
                chat.to(room_name).emit('message',message.text)
            } catch(err) {
                chat.to(room_name).emit('error','не удалось отправить сообщение!')
            }       
        })
    
        console.log('Соединение установленно!')
    })
}