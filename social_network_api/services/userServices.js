const jwt = require('jsonwebtoken'),
    {User, Token} = require('../models/models')
    bcrypt = require('bcrypt')


class UserServices {
    errors = []

    async registration(username,email,password,confirm_password) {
        const email_exists = await User.findOne({where: {email}})
        const username_exists = await User.findOne({where: {username}})

        if (email_exists) {
            this.errors.push('Пользователь с таким Email уже существует!')
        } 

        if (username_exists) {
            this.errors.push('Пользователь с таким Именем уже существует!')
        }

        if (password !== confirm_password) {
            this.errors.push('Пароли не совпадают!')
        }

        if (this.errors.length === 0) {
            const hash_password = await bcrypt.hash(password,5)
            const user = await User.create({
                username: username,
                email: email,
                password:hash_password
            })
            
            return user.toJSON()
        } else {
            return NaN
        }
    }

    async login(username,email,password,confirm_password) {
        if (password !== confirm_password) {
            this.errors.push('Пароли не совпадают!')
        }

        const user = await User.findOne({
            where: {username,email}
        })

        if (user) {
            const password_check = await bcrypt.compare(password,user.password)
            if (!password_check) {
                this.errors.push('Неверный Пароль!')
            }
        } else {
            this.errors.push('Пользователь с таким именем и Email не найден!')
        }

        if (this.errors.length === 0) {
            return user
        } else {
            return NaN
        }
    }

    async generate_tokens(user,old_refresh_token=NaN) {
        const access_token = jwt.sign({
            id: user.id,
            username: user.username,
        },  process.env.SECRET_KEY ,
            {expiresIn: '30m'}
        )

        const refresh_token = jwt.sign({
            id: user.id,
            username: user.username,
            access_token: access_token.slice(-6)
        },  process.env.SECRET_KEY ,
            {expiresIn: '30d'}
        )

        let token_exists
        if (old_refresh_token) {
             token_exists = await Token.findOne({
                where: { 
                    refresh_token : old_refresh_token,
                    userId: user.id,
                }
            })
        } else {
            token_exists = false
        }

        if (token_exists) {
            token_exists.refresh_token = refresh_token
            await token_exists.save()
        } else {
            await Token.create({
                userId: user.id,
                refresh_token: refresh_token
            })
        }

        return {access_token, refresh_token}
    }

    async update_tokens(access_token,refresh_token) {
        try {
            const data = jwt.verify(refresh_token,process.env.SECRET_KEY)
            if (data.access_token !== access_token.slice(-6)) {
                this.errors.push('Неверный Токен!')
                return NaN
            } else {
                return await this.generate_tokens(data,refresh_token)
            }
        } catch {
            this.errors.push('Невалидный токен!')
            
            Token.destroy({
                where: {
                    refresh_token: refresh_token
                }
            })

            return NaN
        }
    }

    async logout(refresh_token) {
        const token = Token.destroy({
            where: {
                refresh_token
            }
        })

        return token
    }
}

module.exports = UserServices