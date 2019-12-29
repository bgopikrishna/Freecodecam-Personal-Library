const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    comments: {
        type: [String]
    }
});


const Book = new mongoose.model('library', bookSchema)


exports.Book = Book