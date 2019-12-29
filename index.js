require('dotenv').config();
const express = require('express');
const cors = require('cors');
const books = require('./routes/books');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log('Connected to mongoDB');
    })
    .catch(err => {
        console.log('Error mongodb', err);
    });

app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(express.json());
app.use(express.urlencoded())

app.use(cors({ optionSuccessStatus: 200 }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/api/books', books);

const port = process.env.PORT || 8000;
const listener = app.listen(port, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
