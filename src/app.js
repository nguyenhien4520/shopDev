const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const app = express();

// middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: true  // allows us to parse URL-encoded bodies
}))
// database
require('./dbs/connectdb');
const {checkOverload} = require('./helpers/countConnect');
checkOverload();
// routes
app.use('/',require('./routes/index'))
// handling errors

app.get('/',(req, res, next) => {
    res.status(200).json({message: "OKOKOISE!"});
})

app.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
        stack: error.stack
    })
})

module.exports = app;