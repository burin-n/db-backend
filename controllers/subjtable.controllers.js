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

exports.getTable = async (req,res) => {
	try{
		const query_string = "select R.SubjID, ST.SDay, ST.StartTime, ST.FinishTime, ST.BuildID, ST.RoomID\
								from Register R, Sectime ST \
								where R.StudentID = ? and R.Cyear = ? and R.CSemester = ?\
								and R.CYear = ST.CYear and R.CSemester = ST.CSemester\
								and R.SubjID = ST.SubjID and R.SecID = ST.SecID"


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