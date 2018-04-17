const db = require('../configs/mysql').database;
const _ = require('lodash');

exports.greeting = (req,res) => {
  res.json({greet:"hello"})
}

exports.getRegisterResult = (req,res) => {

	const query_string = "select SubjID,SecID from Register where \
	StudentID = ? and CYear = ? and CSemester = ?" 

	const fields = ['StudentID', 'CYear', 'CSemester'];
	let values = [];

	fields.forEach( (field) => {
		values.push(req.body[field]);
	});

	db.query(query_string,values, (err,results) => {
		if(err)
			console.log(err);
		else
			res.json({status:1, messaage:"done", data:results});
	});
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

exports.getRequestResult = (req,res) => {
  const query_string = "select * from Request where StudentID = ? \
  order by SubjID DESC, CSemester DESC, SubjID DESC";
  const student_id = req.query.id;
  db.query(query_string,[student_id], (err,results) => {
    if(err)
      console.log(err);
    else{
      res.json({status:1, messaage:"done", data:results});
    }
  });
}

exports.register = (req,res) => {
  const query_string = "insert into Request values ?";
	const fields = ['StudentID', 'SubjID', 'CYear', 'CSemester', 'SecID']
  const values = [];
	let stu_id = _.get(req,['body','StudentID'],null);	
	let year = _.get(req, ['body', 'CYear'] , null);
	let semester = _.get(req, ['body', 'CSemester'], null);

	_.get(req, ['body', 'Subjects']).forEach( ({SubjID, SecID}) => {
		values.push([
			stu_id,
			SubjID,
			year,
			semester,
			SecID	
		]);
	});

  db.query(query_string, [values], (err, results) => {
    if(err)
      console.log(err);
    else{
			
      res.json({status:1,messaage: results.affectedRows + " subjects saved"});
    }
  });
}

exports.delete = (req,res) => {
  let query_string = "DELETE FROM Request WHERE StudentID = ? and \
											CYear = ? and CSemester  = ?";
  const fields = ['StudentID', 'CYear', 'CSemester'];
  let values= []
  fields.forEach( (field) => {
     values.push(req.body[field]); 
  });

  db.query(query_string, values, (err, results) => {
    if(err)
      console.log(err);
    else{
      console.log(results);
      res.json({status:1,messaage:"done"});
    }
  });
}
