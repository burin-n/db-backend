const express = require('./configs/express');
const mysql = require('./configs/mysql');
const passport = require('./configs/passport');
const config = require('./configs/config').app;

mysql.createConnection();
const app = express();
passport();

app.listen(config.port);
console.log('server is running at port ' + config.port);
