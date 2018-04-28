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
	const query_notcompulsory_credit = "select SUM(Sj.Credit) from Register R, Subj Sj where R.StudentID = ? and R.SubjID = Sj.SID and R.Grade in ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D') and \
																			R.SubjID not in (select C.SubjID from CompulsorySubject C where C.FID = ? and C.DID = ? and C.CID = ?)"
	const query_gened_credit = "select SUM(Sj.Credit) from Register R, Subj Sj where R.StudentID = ? and R.SubjID = Sj.SID and Sj.Stype = 'GenEd' and R.Grade in ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D')";
	const query_genlang_credit = "select SUM(Sj.Credit) from Register R, Subj Sj where R.StudentID = ? and R.SubjID = Sj.SID and Sj.Stype = 'GenLang' and R.Grade in ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D')";
	const query_unregist_required = "select distinct C.SubjID from CompulsorySubject C where C.FID = ? and C.DID = ? and C.CID = ? and \
																	C.SubjID not in (select R.SubjID from Register R where R.StudentID = ? and R.Grade in ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D'))";
	const query_condition = "select * from Curriculum C where C.FID = ? and C.DID = ? and C.CID = ?";

	const values = [req.user.FID, req.user.DID, req.user.CID];

	try{
		let freeElect_credit = (await query(query_notcompulsory_credit, [StudentID].concat(values)))[0]['SUM(Sj.Credit)'];
		let gened_credit = (await query(query_gened_credit, [StudentID]))[0]['SUM(Sj.Credit)'];
		let genlang_credit = (await query(query_genlang_credit, [StudentID]))[0]['SUM(Sj.Credit)'];
		let unregisterd = await query(query_unregist_required, values.concat([StudentID]));
		let condition = (await query(query_condition, values))[0];

		if(unregisterd.length > 0){
			res.json({
				status: 2,
				message : "missing compulsory subject",
				unregisterd
			});
		}
		else{
			if(gened_credit == null){
				gened_credit = 0;
			}

			if(genlang_credit == null){
				genlang_credit = 0;
			}

			if(freeElect_credit == null){
				freeElect_credit = 0;
			}

			console.log(gened_credit, genlang_credit, freeElect_credit);

			if(gened_credit > condition.GenedCredit){
				gened_credit = condition.GenedCredit;
			}

			if(genlang_credit > condition.GenlangCredit){
				genlang_credit = condition.GenlangCredit;
			}

			freeElect_credit -= (gened_credit + genlang_credit);

			console.log(gened_credit, genlang_credit, freeElect_credit);
			console.log(condition)

			if(gened_credit < condition.GenedCredit || genlang_credit < condition.GenlangCredit || freeElect_credit < condition.FreeElectCredit){
				res.json({
					status:2,
					message: "missing gened/genlang/freeElect credit",
					result: {gened_credit, genlang_credit, freeElect_credit}
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
