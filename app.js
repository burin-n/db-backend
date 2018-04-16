const express = require('./configs/express');
const mysql = require('./configs/mysql');


mysql.createConnection();
const app = express();

app.listen(3000);
console.log('server is running at port 3000');
