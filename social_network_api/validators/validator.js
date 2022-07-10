const {check} = require('express-validator')


const user_validators = [
    check('username')
        .isLength({max:50}).withMessage('Имя не должно быть быльше 50 символов!')
        .notEmpty().withMessage('Поле должно быть заполнено!'),

    check('password')
        .notEmpty().withMessage('Поле должно быть заполнено!')
        .isLength({min:8}).withMessage('Пароль должен состоять не меньше чем из 8 символов!'),

    check('email')
        .isEmail().withMessage('Введите корректный Email!')
        .notEmpty().withMessage('Поле должно быть заполнено!'),
]

const post_validators = [
    check('title')
        .notEmpty().withMessage('Поле должно быть заполнено!'),
    
    check('text')
        .notEmpty().withMessage('Поле должно быть заполнено!'),
    
    check('cat')
        .notEmpty().withMessage('Поле должно быть заполнено!')
]

const chat_validators = [
    check('title')
        .notEmpty().withMessage('Поле должно быть заполнено!')
]

module.exports = {user_validators,post_validators,chat_validators}