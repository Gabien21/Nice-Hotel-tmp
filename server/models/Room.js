const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
    room_type: {
        type: Number,
        required: true
    },
    room_number: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    state: {
        type: String,
        enum: ['true', 'false']
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