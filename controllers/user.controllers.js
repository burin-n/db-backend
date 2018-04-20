let _ = require('lodash');
let db = require('../configs/mysql').database;
let config = require('../configs/config')
var crypto = require('crypto');

exports.login = async function(req,res){

		const {SID,password} = req.body;	
		const query_string = "select U.SID, S.Fname, S.Mname, S.Lname from StudentUser U, Student S \
													where U.SID = ? and U.password = ? and U.SID = S.SID";
		const values = [
			SID,
			password
		]

		const query_update = "update StudentUser SET token = ? where SID = ?";	

		try{
			let result = await query(query_string, values);
			if(result.length > 0){
				const token = crypto.randomBytes(48).toString('hex') + SID; 
				await query(query_update, [token, SID]);
				res.json({status:1, token, ...result[0]});
			}
			else{
				res.json({status:1, message:"Invalid SID, password"});
			}
		}
		catch(err){
			console.error(new Error(err));
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
