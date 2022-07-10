const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user',{
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const Token = sequelize.define('token',{
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },

    refresh_token: {
        type: DataTypes.STRING,
        unique: true,
    }
})

User.hasMany(Token)
Token.belongsTo(User)

const Category = sequelize.define('category',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        unique: true
    }
})

const Image = sequelize.define('images',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    img: {
        type: DataTypes.STRING,
        unique: true
    }
})

const Post = sequelize.define('post',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    main_photo: {
        type: DataTypes.STRING,
        unique: true
    }
})

Category.hasMany(Post)
Post.belongsTo(Category)

Post.hasMany(Image)
Image.belongsTo(Post)

User.hasMany(Post)
Post.belongsTo(User)

const Message = sequelize.define('message',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

const ChatRoom = sequelize.define('chatroom',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: true
    },

    type: {
        type: DataTypes.STRING,
        defaultValue: 'Dialog'
    }
})

const UserChatRoom = sequelize.define('userchatroom',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

ChatRoom.hasMany(Message)
Message.belongsTo(ChatRoom)

ChatRoom.belongsToMany(User,{through: UserChatRoom})
User.belongsToMany(ChatRoom,{through: UserChatRoom})

User.hasMany(Message)
Message.belongsTo(User)


module.exports = {User,Token,Post,Category,Image,ChatRoom,Message}