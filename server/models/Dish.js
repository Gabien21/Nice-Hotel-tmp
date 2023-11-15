const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DishSchema = new Schema({
    dish_name: {
        type: String,
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

module.exports = mongoose.model('dishes', DishSchema)