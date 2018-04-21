const query = require('../configs/mysql').query;
const _ = require('lodash'); 

exports.compute = async (req,res) => {
	
	let query_string = "select * from Register, Subj where SID = SubjID \
	and StudentID = ? and SID ORDER BY CSemester DESC, CYear DESC"

	const SID = req.user.SID;

	map_grade ={
		'A' : 4,
		'B+' : 3.5,
		'B' : 3,
		'C+' : 2.5,
		'C' : 2,
		'D+' : 1.5,
		'D' : 1,
		'F' : 0,
		//'I', 'M', 'P', 'S', 'U', 'V', 'W', 'X'
		'X' : -1
	}


	try{
		let results = await query(query_string, [SID]);
		let ret = [];
		
		let semester = await getSemester(results);
		
		let gpax = 0;
		let acc_credit = 0;


		for (let sem of semester){
			let subjs = [];

			let gpa = 0;
			let term_credit = 0;
			let can_gpa = true;

			for (let subj of results){
				if(`${subj.CYear}/${subj.CSemester}` === sem){
					subjs.push({
						Name : subj.SName,
						ID : subj.SubjID,
						Grade : subj.Grade,
						Credit : subj.Credit
					});

					if(map_grade[subj.Grade] < 0)
						can_gpa = false;
					
					gpa += map_grade[subj.Grade]*subj.Credit;
					term_credit += subj.Credit;
				}
			}

			if(can_gpa){
				gpax += gpa;
				gpa /= term_credit;
				acc_credit += term_credit;
				temp_gpax = gpax/acc_credit;
			}
			else{
				gpa = "X";
				temp_gpax = "X";
				acc_credit += term_credit;
			}
			
			ret.push({Semester: sem,
				Subjects: subjs,
				GPA : gpa,
				Credit: term_credit,
				Total_credit: acc_credit,
				GPAX: temp_gpax
			});
		}

		res.json(ret);

	}catch(e){
		res.json(e)
	}
}

function getSemester(results){
	return new Promise( (resolve,reject) => {
		semester = [];
			
		for (let sub of results){
			let {CYear, CSemester} = sub;
			if(semester.indexOf(`${CYear}/${CSemester}`) < 0){
				semester.push(`${CYear}/${CSemester}`);
			}
		}
		resolve(semester.sort());
	});
}