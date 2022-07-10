const e = require('express')
const {Post, Category, User,Image} = require('../models/models'),
    uuid = require('uuid'),
    path = require('path')

class PostServices {
    
    async get_all_posts(page,limit) {
        page = page || 1
        limit = limit || 5
        const offset = page * limit - limit
        
        return await Post.findAll({
            include: [{
                model: User,
                attributes: ['id','username']
            },{
                model: Image,
                attributes: ['id','img']
            }], 
            limit:limit,
            offset:offset
        })
    }

    async create_post(title,text,cat,user_id,files) {
        let cat_id
        let category = await Category.findOne({
            where: {
                name: cat,
            }
        })
        
        if ( category) {
            cat_id = category.id
        } else {
            category = await Category.create({
                name: cat
            })

            cat_id = category.toJSON().id
        }

        const post = await Post.create({
            title: title,
            text: text,
            userId: user_id,
            categoryId: cat_id
        })

        if (files) {
            const create_files = {}
            for (let f in files) {
                const file_name =  uuid.v4() + '.jpg'

                if (f === 'main_photo') {
                    post.main_photo = file_name
                    post.save()
                } else {
                    create_files.postId = post.id
                    create_files.img = file_name
                }

                files[f].mv(path.resolve(__dirname,'..','media',file_name))
            }

            if (Object.keys(create_files).length !== 0) await Image.bulkCreate([create_files])
        }

        return post
    }

    async detail_post(id) {
        const post = await Post.findOne({
            where: {
                id: id
            },
            include: [{
                model: User,
                attributes: ['id','username']
            },{
                model: Image,
                attributes: ['id','img']
            }]
        })

        return post
    }

    async delete_post(id) {
        await Post.destroy({
            where: {
                id: id
            }
        })
    }

    async update_post(id,data) {
        const update_data = {}

        for (let d in data) {
            if (data[d]) {
                update_data[d] = data[d]
            }
        }

        const updated_post = await Post.update(
            update_data,
            {
                where: {id: id}
            }
        )
        
        return
    }
}


module.exports = new PostServices()