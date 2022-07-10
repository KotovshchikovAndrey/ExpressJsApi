window.onload = function(){
    let socket = io('/chat',{ query: 'room_id=10' })
    
    socket.emit('message',{msg:'Тест','user_id':28})
    socket.on('message', function(data){
        console.log(data)
    })

    socket.on('error', function(err){
        console.log(err)
    })
}