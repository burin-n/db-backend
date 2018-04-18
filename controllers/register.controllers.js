const db = require('../configs/mysql').database;
const _ = require('lodash'); 
exports.greeting = (req,res) => {
  res.json({greet:"hello, this is db backend server"})
}

exports.getRegisterResult = async (req,res) => {

	const query_string  = "select SubjID,SecID,SName,Credit \
		from Register R, Subj S where R.StudentID = ? and R.CYear = ? \
		and R.CSemester = ? and S.SID = R.SubjID";

	const fields = ['StudentID', 'CYear', 'CSemester'];
	let values = [];

	fields.forEach( (field) => {
		values.push(req.body[field]);
	});
	
	results = await query(query_string, values);

	let ret = {};
	ret.StudentID = req.body.StudentID;
	ret.CYear = req.body.CYear;
 	ret.CSemester = req.body.CSemester;	
	ret.Subjects = results;	
	res.json(ret);
}

// add subject
exports.add = async (req,res) => {

	const query_current = "select SubjID from Register where StudentID = ? \
												 and CYear = ? and CSemester = ?";
	const fields_current = ['StudentID', 'CYear', 'CSemester'];
	let val_current = [];	


	const query_seat = "select Seat,RegSeat from Section where SubjID = ? and \
												CYear = ? and CSemester = ? and SecID = ?";
	const field_seat = ['SubjID', 'CYear', 'CSemester', 'SecID'];	
	let val_seat = [];

	const query_insert = "insert into Register set ?"
	let val_insert = {
		'StudentID': req.body.StudentID,
		'SubjID': req.body.SubjID, 
		'CYear' : req.body.CYear,
		'CSemester' : req.body.CSemester, 
		'SecID' : req.body.SecID, 
	}

	fields_current.forEach( (field) => {
		val_current.push(req.body[field]);	
	});
	
	current_register = await query(query_current, val_current);
	current_register_list = current_register.map ( e => {
		return e.SubjID;
	});

	field_seat.forEach( (field) => {
		val_seat.push( _.get(req, ['body',field], null) );
	});

	let ret = [];
	for(let subj of req.body.Subjects){
				
		val_seat[0] = subj.SubjID;	
		val_seat[3] = subj.SecID;

		let seat = await query(query_seat, val_seat);
		let RegSeat = _.get(seat, [0, 'RegSeat'], 100);
		let Seat = _.get(seat, [0, 'Seat'] , 100);
		
		if(current_register_list.indexOf(subj.SubjID) >= 0){
			result = "already added";
		}
		else if( RegSeat < Seat ){
			try{
				val_insert.SubjID = subj.SubjID;
				val_insert.SecID = subj.SecID;
				await query(query_insert, val_insert);
				result = "success"
			}catch(e){
				console.log(e);
				result = "error";
			}
		}
		else{
			result = "failed"
		}

		ret.push({});
		_.set(ret, [ret.length-1, "SubjID" ], subj.SubjID);
		_.set(ret, [ret.length-1, "SecID" ], subj.SecID);
		_.set(ret, [ret.length-1, "Result"], result);
	}

	res.json({status:1, result:ret});
}


//remove subject
exports.remove = async (req,res) => {
	const {Subjects} = req.body; 

	const query_string = "delete from Register where StudentID = ? and SubjID = ? and \
												CYear = ? and CSemester = ? and SecID = ?";
	const fields = ['StudentID','SubjID', 'CYear', 'CSemester', 'SecID'];	
	let values = [];

	fields.forEach( field => {
		values.push( _.get(req, ['body', field], null) );
	});
	
	let ret = [];

	for(let subj of Subjects){

		values[1] = subj.SubjID;
		values[4] = subj.SecID;

		try{
			await query(query_string, values);
			result = "success";
		}catch(e){
			console.log(e);
			result = "fail"
		}

		ret.push({ SubjID: subj.SubjID, result });
	}
	
	res.json({status:1, results:ret});	

}

exports.getDetail = async (req,res) => {
	const SubjID = req.query.SubjID; 
	const query_string = "select SName, Credit from Subj where SID = ?"
	let result;
	try{	
		result = await query(query_string, [SubjID]	);
		if(result.length === 0)
			res.json({status:2, message:"no subject found"});
		else
			res.json({...result[0], status:1});
	} catch (e) {
		console.error(e);
		res.status(500).json({status:0, error:"error"});	
	}
}


exports.processRequest = (req,res) => {
	new Promise( (resolve,reject) => {

		let query_string = "select * from Section where \
		CYear = ? and CSemester = ?" 

		let fields = ['CYear', 'CSemester'];
		let values = [];

		fields.forEach( (field) => {
			values.push(req.body[field]);
		});

		db.query(query_string, values, (err,sections) => {
			if(err) reject(err);
			else resolve(sections);
		});

	}).catch( (err) => {
		return Promise.reject(err);
	}).then( (sections) => {
		
		let promises = [];
		let query_string = "select Distinct studentID from Request where \
												SubjID = ? and CYear = ? and CSemester = ? and SecID = ?";
		let fields = ['SubjID', 'CYear', 'CSemester', 'SecID'];

		sections.forEach( (section) => {

			let values = [];

			fields.forEach( (field) => {
				values.push(section[field]);
			});

			let promise = new Promise( (resolve,reject) => {
				db.query(query_string, values, (err,studentIDs) => {
					if(err){}
					else{
						resolve({section,studentIDs});
					}
				});
			});

			promises.push(promise);

		});
		
		return Promise.all(promises);

	}).catch( (err) => {
		return Promise.reject(err);
	}).then( (data_list) => {
		let query_string = "insert into Register set ?";

		return Promise.all(data_list.map( (data) => {

			let num_stu = parseInt(_.get(data, ['studentIDs','length'], 0));
			let num_seat = parseInt(_.get(data, ['section','Seat'], 0));
			let selectedStudents = [];

			for(let i=0; i < Math.min(num_seat,num_stu); i++){
				let lucky_man = num_stu+1;
				while(_.get(data, ['studentIDs',lucky_man], null) == null){
					lucky_man = parseInt( Math.random()*num_stu );
				}
				selectedStudents.push( _.get(data, ['studentIDs', lucky_man, 'studentID']) );	
				_.set(data, ['studentIDs', lucky_man] , null);
			}

			return Promise.all(selectedStudents.map( (stu_id) => {

				return new Promise( (resolve,reject) => {
					let values = {
						StudentID: stu_id,
						SubjID: data.section.SubjID,
					 	CYear: data.section.CYear,
					 	CSemester: data.section.CSemester, 
						SecID: data.section.SecID, 
						Grade: null, 
						MSeatNo: null,
						FSeatNo: null 
					};
					db.query(query_string,values, (err, results) => {
						if(err){
							resolve({err:err});
						}
						else resolve(results);
					});
				});	

			}));

		}));	

	}).catch( (err) =>{
		console.error(err);
		res.status(500).json({status:0, error:"error"});	
	}).then( (result) => {
		console.log(result);
		res.json({status:1, message:"done"});
	});
}

//delete register result in a semester
exports.deleteRegister = (req,res) => {
	const query_string = "delete from Register where CSemester = ? \
												and CYear = ?";
	db.query(query_string, [
		_.get(req, ['body', 'CSemester'], null),
		_.get(req, ['body', 'CYear'], null)
	], (err, results) => {
		if(err){
			console.error(err);
			res.status(500).json({status:0, error:"error"});
		}
		else{
			res.json({status:1, message:"done"});		
		}	
	});		
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

