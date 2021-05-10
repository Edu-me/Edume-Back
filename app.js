require('dotenv').config()
require('express-async-errors')
const morgan = require('morgan')
const express = require('express');
serverDebugger = require('debug')('server')
const app = express();
let cors = require('cors')
const addAdmin = require('./utils/adminRegister')
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}
app.use(cors())
require('./start-up/routes')(app);
require('./start-up/db')();
const port = process.env.PORT || 3000;
app.listen(port, () => serverDebugger(`Listening on port ${port}...`));
//addAdmin("mohamed.samy@Edume.com","ABab12!@","smsm")