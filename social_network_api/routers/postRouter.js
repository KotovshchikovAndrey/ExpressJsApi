const express = require('express'),
    router = express.Router(),
    PostController = require('../controllers/postController'),
    JwtMiddleware = require('../middleware/JwtMiddleware'),
    { post_validators } = require('../validators/validator')

router.get('/all',PostController.all_posts)
router.get('/detail/:id',PostController.detail_post)
router.post('/create',post_validators,JwtMiddleware,PostController.create_post)
router.put('/update/:id',PostController.update_post)
router.delete('/delete/:id',PostController.delete_post)


module.exports = router