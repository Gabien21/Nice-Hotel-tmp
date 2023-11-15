const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InfoSchema = new Schema({
    full_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('info', InfoSchema)