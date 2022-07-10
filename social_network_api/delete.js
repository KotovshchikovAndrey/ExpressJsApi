const models = require('./models/models')

function delete_all_db() {
    for (m in models) {
        if (m !== 'User') {
            models[m].destroy({
                where: {}
            })
        }
    }
}

delete_all_db()