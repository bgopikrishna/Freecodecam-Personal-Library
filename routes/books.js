const express = require('express');
const { Book } = require('../models/books');
const Joi = require('@hapi/joi');

const router = express.Router();

router.get('/', async (req, res) => {
    const books = await Book.find();
    books = books.map(({ title, _id, comments }) => {
        return {
            title,
            _id,
            commentcount: comments.length
        };
    });
    res.send(books);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`id ${id}`);

    const book = await Book.findById(id);
    console.log(book);
    if (book) {
        return res.send(book);
    } else {
        return res.send('no book exists');
    }
});

router.post('/', async (req, res) => {
    const titleObj = Joi.object({ title: Joi.string().required() }).validate(
        req.body
    );

    if (titleObj.error) {
        return res.send(titleObj.error.message);
    }

    let newBook = new Book({ title: titleObj.value.title });
    newBook = await newBook.save();
    const { title, _id } = newBook;
    res.send({ title, _id });
});

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const commentObj = Joi.object({
        comment: Joi.string().required(),
        id: Joi.string().optional()
    }).validate(req.body);

    if (commentObj.error) {
        return res.send(commentObj.error.message);
    }

    const updatedBook = await Book.findOneAndUpdate(
        { _id: id },
        { $push: { comments: commentObj.value.comment } },
        { new: true }
    );

    if (updatedBook) {
        const books = await Book.find();
        return res.send(books);
    } else {
        return res.send('no book exists');
    }
});

// router.put('/:id', async (req, res) => {});

router.delete('/:id', async (req, res) => {
    const bookIdObj = Joi.object({ id: Joi.string().required() }).validate(
        req.params
    );

    if (bookIdObj.error) {
        return res.send(bookIdObj.error.message);
    }

    const deletedBook = await Book.findByIdAndDelete(bookIdObj.value.id);

    if (deletedBook) {
        res.send('delete successful');
    } else {
        return res.send('no book exists');
    }
});

router.delete('/', async(req,res) => {
    const deleted = await Book.deleteMany({});

    if(deleted){
        res.send('complete delete successful')
    } else {
        res.send('error ocurred during deleting')
    }
})

module.exports = router;
