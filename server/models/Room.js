const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
    room_type: {
        type: String,
        required: true
    },
    room_number: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    state: {
        type: String,
        enum: ['true', 'false'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('rooms', RoomSchema)