const db = require('../configs/mysql').database;
const _ = require('lodash'); 

// get request result
exports.getRequestResult = async (req,res) => {
	const query_string  = "select SubjID,SecID,SName,Credit \
		from Request R, Subj S where R.StudentID = ? and R.CYear = ? \
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

// make request
exports.makeRequest = (req,res) => {
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

// delete request
exports.deleteRequest = (req,res) => {
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
