let mysql = require('mysql');
let db_conf = require('./config').db;

var connection = mysql.createConnection(db_conf);


exports.createConnection = () => {
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('database connected');
	});
	// return connection;
}

exports.query = function(string, val){
	return new Promise( (resolve,reject) => {
	  connection.query(string, val, (err, results) => {
			if(err)
				reject(err);
			else{
				resolve(results);
			}
		});	
	});
}

exports.database = connection;