const express = require('express'),
    router = express.Router(),
    ChatController = require('../controllers/chatController'),
    JwtMiddleware = require('../middleware/JwtMiddleware'),
    { chat_validators } = require('../validators/validator')

router.get('/dialog/:user_id',JwtMiddleware,ChatController.dialog)
router.post('/create_group',chat_validators,JwtMiddleware,ChatController.create_group)
router.put('/delete_from_group/:group_id',JwtMiddleware,ChatController.delete_from_group)


module.exports = router 
