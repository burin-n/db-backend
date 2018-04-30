const query = require('../configs/mysql').query;
const _ = require('lodash'); 

function sToint(b){
	ret = [];
	var z = 0;
	for (var i = 0 ; i < b.length ; i++){
		if ( b[i] == ':'){
			ret.push(z);
			z = 0
		}else{
			z *= 10;
			z += (b[i]-'0');
		}
	}
	return ret;
}

function parseTable(a){
	result = {}
	date = {1:"Mon" , 2:"Tue" , 3:"Wed" , 4:"Thu" , 5:"Fri"};
	for (key in date){
		result[date[key]] = [];
	}
	for (var x = 0 ; x < a.length ; x++){
		var day = date[a[x].SDay];
		var data={
					"SubjID":a[x].SubjID,
					"SName" : a[x].SName,
					"BID":a[x].BuildID,
					"RID":a[x].RoomID,
					"STime":sToint(a[x].StartTime) , 
					"FTime":sToint(a[x].FinishTime)
				 };
		result[day].push(data);
	}
	for( key in date){
		for ( var i = 0 ; i < result[date[key]].length ; i++){
			for( var j = i+1 ; j < result[date[key]].length ; j++){
				if(result[date[key]][i]["STime"][0] > result[date[key]][j]["STime"][0]){
					var tmp = dresult[date[key]][i];
					result[date[key]][i] = result[date[key]][j];
					result[date[key]][j] = tmp;
				}else if(result[date[key]][i]["STime"][0] == result[date[key]][j]["STime"][0]){
					if(result[date[key]][i]["STime"][1] > result[date[key]][j]["STime"][1]){
						var tmp = dresult[date[key]][i];
						result[date[key]][i] = result[date[key]][j];
						result[date[key]][j] = tmp;
					}
				}
			}
		}
	}
	return result;
}

exports.getSubjTable = async (req,res) => {
	try{
		const query_string = "select R.SubjID, ST.SDay, ST.StartTime, ST.FinishTime, ST.BuildID, ST.RoomID, Sj.SName\
								from Register R, Sectime ST, Subj Sj\
								where R.StudentID = ? and R.Cyear = ? and R.CSemester = ?\
								and R.CYear = ST.CYear and R.CSemester = ST.CSemester\
								and R.SubjID = ST.SubjID and R.SecID = ST.SecID and Sj.SID = R.SubjID";


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
	 	ret.Table = parseTable(results);
			
		res.json(ret);
	}
	catch(e){
		console.error(e);
		res.status(500).json({status:0});	
	}
}

function  parseMidExamDT(a){
	var result = [];
	var b = {};
	for(var i = 0 ; i < a.length ; i++){
		var key = a[i]["SubjID"];
		if (b[key] > 0){
			var chk = -1;
			for(var j = 0 ; j < result[b[key]-1]["Place"].length ; j++){
				if(a[i]["BuildID"] == result[b[key]-1]["Place"][j]["BuildID"]){
					chk = j;
					break;
				}
			}
			if(j > -1){
				result[b[key]-1]["Place"][j]["RoomID"].push(a[i]["RoomID"]);
			}else{
				var tmp = {};
				tmp.BuildID = a[i]["BuildID"];
				tmp.RoomID = [];
				tmp.RoomID.push(a[i]["RoomID"]);
				a[i]["Place"].push([tmp]);
			}
			continue;
		}
		b[key] = i+1;
		var ms = a[i]["MExamS"];
		var mf = a[i]["MExamF"];
		//console.log(typeof ms);
		
		var tmp = {};
		tmp.BuildID = a[i]["BuildID"];
		tmp.RoomID = [];
		tmp.RoomID.push(a[i]["RoomID"]);
		a[i]["Place"] = [tmp];
		delete a[i]["BuildID"];
		delete a[i]["RoomID"];
		b.x = (""+ms+"");
		b.y = (""+mf+"");
		var date = b.x.substr(0,b.x.indexOf("201")+4);
		a[i]["Date"] = date.substr(0,3)+" "+date.substr(8,2)+"/"+date.substr(4,3)+"/"+date.substr(11);
		delete a[i]["MExamS"];
		a[i]["Start"] = b.x.substr(b.x.indexOf("201")+5,5);
		delete a[i]["MExamF"];
		a[i]["Finish"] = b.y.substr(b.x.indexOf("201")+5,5);
		result.push(a[i]);
	}
	
	return result;
	
}

exports.getMidTable = async (req,res) => {
	try{
		const query_string = "select R.SubjID, S.SName, C.MExamS, C.MExamF, M.BuildID, M.RoomID\
								from Register R, Course C, MidtermExamRoom M, Subj S \
								where R.StudentID = ? and R.Cyear = ? and R.CSemester = ?\
								and R.CYear = C.CYear and R.CSemester = C.CSemester\
								and R.SubjID = C.SubjID and C.SubjID = M.SubjID\
								and C.CYear = M.CYear and C.CSemester = M.CSemester\
								and S.SID = R.SubjID"


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
	 	ret.Table = parseMidExamDT(results);

			
		res.json(ret);
	}
	catch(e){
		console.error(e);
		res.status(500).json({status:0});	
	}
}

function  parseFinExamDT(a){
	var result = [];
	var b = {};
	for(var i = 0 ; i < a.length ; i++){
		var key = a[i]["SubjID"];
		if (b[key] > 0){
			var chk = -1;
			for(var j = 0 ; j < result[b[key]-1]["Place"].length ; j++){
				if(a[i]["BuildID"] == result[b[key]-1]["Place"][j]["BuildID"]){
					chk = j;
					break;
				}
			}
			if(j > -1){
				result[b[key]-1]["Place"][j]["RoomID"].push(a[i]["RoomID"]);
			}else{
				var tmp = {};
				tmp.BuildID = a[i]["BuildID"];
				tmp.RoomID = [];
				tmp.RoomID.push(a[i]["RoomID"]);
				a[i]["Place"].push([tmp]);
			}
			continue;
		}
		b[key] = i+1;
		var ms = a[i]["FExamS"];
		var mf = a[i]["FExamF"];
		//console.log(typeof ms);
		
		var tmp = {};
		tmp.BuildID = a[i]["BuildID"];
		tmp.RoomID = [];
		tmp.RoomID.push(a[i]["RoomID"]);
		a[i]["Place"] = [tmp];
		delete a[i]["BuildID"];
		delete a[i]["RoomID"];
		b.x = (""+ms+"");
		b.y = (""+mf+"");
		var date = b.x.substr(0,b.x.indexOf("201")+4);
		a[i]["Date"] = date.substr(0,3)+" "+date.substr(8,2)+"/"+date.substr(4,3)+"/"+date.substr(11);
		delete a[i]["FExamS"];
		a[i]["Start"] = b.x.substr(b.x.indexOf("201")+5,5);
		delete a[i]["FExamF"];
		a[i]["Finish"] = b.y.substr(b.x.indexOf("201")+5,5);
		result.push(a[i]);
	}
	
	return result;
	
}

exports.getFinTable = async (req,res) => {
	try{
		const query_string = "select R.SubjID, S.SName, C.FExamS, C.FExamF, M.BuildID, M.RoomID\
								from Register R, Course C, MidtermExamRoom M, Subj S \
								where R.StudentID = ? and R.Cyear = ? and R.CSemester = ?\
								and R.CYear = C.CYear and R.CSemester = C.CSemester\
								and R.SubjID = C.SubjID and C.SubjID = M.SubjID\
								and C.CYear = M.CYear and C.CSemester = M.CSemester\
								and S.SID = R.SubjID"


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
	 	ret.Table = parseFinExamDT(results);

			
		res.json(ret);
	}
	catch(e){
		console.error(e);
		res.status(500).json({status:0});	
	}
}