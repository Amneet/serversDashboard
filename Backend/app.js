const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const nameRoutes = require('./routes/nameRoute');
const serverRoutes = require('./routes/serverRoute');
const commentRoutes = require('./routes/commentRoute');

const url = require('./constants/mongoUrlCreds');

const app = express();

app.use(bodyParser.json());

app.set('etag', false)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Cache-Control', 'no-cache');
    res.set('Cache-Control', 'no-store')
    next();
})

app.use('/names', nameRoutes)
app.use('/servers', serverRoutes);
app.use('/comments', commentRoutes);

mongoose.connect(
    url
    , {useFindAndModify: false}
    )
    .then(() => {
        app.listen(5010);
        console.log('Connected!')
    })
    .catch((err) => {
        console.log('Connection failed!', err)
    });
    