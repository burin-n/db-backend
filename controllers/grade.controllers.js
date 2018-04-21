const query = require('../configs/mysql').query;
const _ = require('lodash'); 

exports.compute = async (req,res) => {
	
	let query_string = "select * from Register, Subj where SID = SubjID \
	and StudentID = ? and SID ORDER BY CSemester DESC, CYear DESC"

	const SID = req.user.SID;

	const map_grade = {
		'A' : 4,
		'B+' : 3.5,
		'B' : 3,
		'C+' : 2.5,
		'C' : 2,
		'D+' : 1.5,
		'D' : 1,
		'F' : 0,
		
		'S' : -1, 
		'U' : -1, 
		'W' : -1,
		'X' : -2, 
	};


	try{
		let results = await query(query_string, [SID]);
		let ret = [];
		
		let semester = await getSemester(results);
		
		let CAX = 0;
		let CGX = 0;
		let GPAX = 0;
		let GPX = 0;


		for (let sem of semester){
			let subjs = [];
			let CA = 0;
			let CG = 0;
			let GPA = 0;
			let can_gpa = true;

			for (let subj of results){
				if(`${subj.CYear}/${subj.CSemester}` === sem){
					subjs.push({
						Name : subj.SName,
						ID : subj.SubjID,
						Grade : subj.Grade,
						Credit : subj.Credit
					});

					if( _.get(map_grade, subj.Grade, -2) === -2){
						can_gpa = false;
					}

					if( subj.Grade === 'S'){
						CG += subj.Credit;
					}
					else if(['U', 'W'].indexOf(subj.Grade) >= 0){
						// do nothing
					}
					else if(_.get(map_grade, subj.Grade, -2) !== -2){
						CA += subj.Credit;
						CG += subj.Credit;
						GPA += map_grade[subj.Grade] * subj.Credit;
					}
					console.log(CA,CG,GPA)
				}
			}

			if(can_gpa){
				GPX += GPA;
				GPA /= CA;
				CAX += CA;
				CGX += CG;
				GPAX = GPX / CAX;
				temp_GPX = GPX;
			}
			else{
				GPA = "X";
				GPAX = "X";
				temp_GPX = "X"
			}
			
			ret.push({Semester: sem,
				Subjects: subjs,
				GPA,
				CA,
				CG,
				CAX,
				CGX,
				GPAX,
				GPX : temp_GPX,
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