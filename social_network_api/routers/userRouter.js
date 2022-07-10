const express = require('express'),
    router = express.Router(),
    UserController = require('../controllers/userController'),
    {user_validators} = require('../validators/validator')


router.post('/registration',user_validators,UserController.registration)
router.post('/login',user_validators,UserController.login)
router.get('/update',UserController.update_tokens)
router.get('/logout',UserController.logout)

module.exports = router