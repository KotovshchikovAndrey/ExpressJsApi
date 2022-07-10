const express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    hbs = require('hbs'),
    io = require('socket.io')(http),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    sequelize = require('./db'),
    router = require('./routers/indexRouter'),
    bodyParser = require('body-parser'),
    path = require('path'),
    ErrorMiddleware = require('./middleware/ErrorMidleware'),
    fileUpload = require('express-fileupload'),
    ChatWebsocket = require('./websockets/chatWebsocket')(io)
    require('dotenv').config()

    
const host = 'localhost'
const port = 8000


// app.set('view engine','hbs')
// app.set('views',path.join(__dirname,'views'))

app.use(fileUpload({}))
app.use(express.static(path.join(__dirname,'static')))
app.use('/media',express.static(path.join(__dirname,'media')))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/api',router)
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
})
app.use(ErrorMiddleware)

// {
//     "email": "ykt_andrey@mail.ru",
//     "username": "Андрей",
//     "password": "12345",
//     "confirm_password": "12345"
// }

// {
//     "title": "12345",
//     "text": "12345",
//     "cat":"12345"
// }

// app.get('/',function(req,res){
//     return res.render('index.hbs')
// })  

async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        http.listen(port,host,() => console.log(`Сервер Запущен на ${host}:${port}`))
    } catch(e) {
        console.log(e)
    }
}

start()

