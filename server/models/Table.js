const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
    table_type: {
        type: Number,
        required: true
    },
    table_number: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: ['true', 'false']
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('tables', TableSchema)