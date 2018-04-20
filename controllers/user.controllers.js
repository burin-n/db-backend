let _ = require('lodash');
let db = require('../configs/mysql').database;
let config = require('../configs/config').user;
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

exports.login = async function(req,res){

		const {SID,password} = req.body;	
		const query_string = "select U.SID, U.password, S.Fname, S.Mname, S.Lname from StudentUser U, Student S \
													where U.SID = ? and U.SID = S.SID";
		const values = [ SID ];

		const query_update = "update StudentUser SET token = ? where SID = ?";	

		try{
			let result = await query(query_string, values);
			if(result.length > 0){
				if( await bcrypt.compare(password, result[0].password) ){
					const token = crypto.randomBytes(48).toString('hex') + SID; 
					await query(query_update, [token, SID]);
					res.json({status:1, token, ...result[0]});
				}
				else throw Error("invalid");
			}
			else{
				throw Error("invalid");
			}
		}
		catch(err){
			console.error(err);
			if(err.message === "invalid")
				res.json({status:2, message:"Invalid SID, password"});
			else
				res.status(500).json({"status":0, error:"Internal Error"});
		}
}

exports.logout = async function(req, res){
	
	const token = _.get(req ,['user','token'], null);
	const SID = _.get(req, ['user', 'SID'], null);
	console.log(req.user);
	console.log(token, SID);
	const query_string = "update StudentUser set token = null where SID = ?";
	
	try{
		let result = await query(query_string, [SID]);
		if(result[0].affectedRows > 0)
			res.json({status:1, message:"success"});	
		else
			throw("Something went wrong");
	}catch(e){
		res.status(500).json({status:0});
	}	

}

exports.profile = function(req, res){
	if(_.get(req, 'user' , null) === null || req.user === 'Unauthorized'){
		res.json({message: "No user found"});
	}	
	else{
		res.json(req.user);
	}
}

exports.set_password = async (req,res) => {
	try{
		const query_message = "insert into StudentUser set ?";
		const hashed =  await hash_password(req.body.password);
		console.log(hashed);
		console.log(hashed.length);
		let values = {
			SID: req.body.SID,
			password : hashed,
			password_plain : req.body.password,
			token : _.get(req, ['body', 'token' ] , null)
		};
		await query(query_message, values);
		res.json({status:1, message:"done"});
	}
	catch(e){
		console.error(e);
		res.json({status:0, error:e['message']});
	}
}

function query(string, val){
	return new Promise( (resolve,reject) => {
	  db.query(string, val, (err, results) => {
			if(err)
				reject(err);
			else{
				resolve(results);
			}
		});	
	});
}

async function hash_password(password) {
	return new Promise( (resolve,reject) => {
		bcrypt.hash(password, config.salt_len, function(err, hash) {
			if(err) reject(err);
			else resolve(hash);
		});
	});
}
