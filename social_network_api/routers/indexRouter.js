const express = require('express'),
    router = express.Router(),
    userRouter = require('./userRouter'),
    postRouter = require('./postRouter'),
    chatRouter = require('./chatRouter')

router.use('/user',userRouter)
router.use('/post',postRouter)
router.use('/chat',chatRouter)


module.exports = router