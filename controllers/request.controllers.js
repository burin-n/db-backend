const query = require('../configs/mysql').query;
const _ = require('lodash'); 

// get request result
exports.getRequestResult = async (req,res) => {
	try{
		const query_string  = "select SubjID,SecID,SName,Credit \
			from Request R, Subj S where R.StudentID = ? and R.CYear = ? \
			and R.CSemester = ? and S.SID = R.SubjID";

		const fields = ['CYear', 'CSemester'];
		let values = [ req.user.SID ];

		fields.forEach( (field) => {
			values.push(req.body[field]);
		});

		results = await query(query_string, values);
		let ret = {};
		ret.StudentID = req.user.SID;
		ret.CYear = req.body.CYear;
	 	ret.CSemester = req.body.CSemester;	
		ret.Subjects = results;	
		res.json(ret);
	}
	catch(e){
		console.error(e);
		res.status(500).json({status:0});	
	}
}

// make request
exports.makeRequest = async (req,res) => {
	try{
		const query_string = "insert into Request values ?";

		const fields = ['StudentID', 'SubjID', 'CYear', 'CSemester', 'SecID']


		const stu_id = _.get(req,['user','SID'],null);	
		const year = _.get(req, ['body', 'CYear'] , null);
		const semester = _.get(req, ['body', 'CSemester'], null);

		const values = [];

		_.get(req, ['body', 'Subjects']).forEach( ({SubjID, SecID}) => {
			values.push([
				stu_id,
				SubjID,
				year,
				semester,
				SecID	
			]);
		});

		let results = await query(query_string, [values]);
		console.log(results);
		res.json({status:1,messaage: results.affectedRows + " subjects saved"});

	}catch(e){
		console.error(e);
		if(e.code === "ER_DUP_ENTRY")
			res.json({status:0, error:"duplicate"});
		else
			res.status(500).json({status:0});
	}
}

// delete request
exports.deleteRequest = async (req,res) => {
	try{
		let query_string = "DELETE FROM Request WHERE StudentID = ? and \
												CYear = ? and CSemester  = ?";
		const fields = ['CYear', 'CSemester'];
		const StudentID = req.user.SID;

		let values= [StudentID]

		fields.forEach( (field) => {
			 values.push(req.body[field]); 
		});

		await query(query_string, values);
		res.json({status:1,messaage:"done"});
	} catch(e){
		console.error(e);
		res.status(500).json({status:0});
	}
}


exports.reqGrad = async (req,res) => {
	const StudentID = _.get(req, ['user', 'SID'] , null);
	const query_gened_credit = "select SUM(Sj.Credit) from Register R, Subj Sj where R.StudentID = ? and R.SubjID = Sj.SID and Sj.Stype = 'GenEd'";
	const query_genlang_credit = "select SUM(Sj.Credit) from Register R, Subj Sj where R.StudentID = ? and R.SubjID = Sj.SID and Sj.Stype = 'GenLang'";
	const query_unregist_required = "select distinct C.SubjID from CompulsorySubject C where C.FID = ? and C.DID = ? and C.CID = ? and \
																	not exists (select R.SubjID from Register R where R.StudentID = ?)";
	const query_condition = "select * from Curriculum C where C.FID = ? and C.DID = ? and C.CID = ?";

	const values = [req.user.FID, req.user.DID, req.user.CID];

	try{
		let gened_credit = (await query(query_gened_credit, [StudentID]))[0]['SUM(Sj.Credit)'];
		let genlang_credit = (await query(query_genlang_credit, [StudentID]))[0]['SUM(Sj.Credit)'];
		let unregisterd = await query(query_unregist_required, values.concat([StudentID]));
		let condition = (await query(query_condition, values))[0];
		
		console.log(gened_credit, genlang_credit);	
		console.log(condition)
		
		if(unregisterd.length > 0){
			res.json({
				status: 2,
				message : "missing compulsory subject",
				unregisterd
			});	
		}
		else{
			if(gened_credit > condition.GenedCredit){
				genlang_credit += condition.GenedCredit - gened_credit;
				gened_credit = condition.GenedCredit;
			}
			
			if(gened_credit < condition.GenedCredit || genlang_credit < condtion.GenlangCredit){
				res.json({
					status:2,
					message: "missing gened/genlang credit",
					result: {genlang_credit, genlang_credit}
				});
			}
			else{
				res.json({
					status:1,
					message: "grad!"
				})
			}
		}
	}
	catch(e){
		console.error(e)
		res.json({status:0});
	}
}