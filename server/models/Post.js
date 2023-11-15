const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    description: {
        type: String
    },
    rate: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('post', PostSchema)