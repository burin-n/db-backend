const query = require('../configs/mysql').query;
const _ = require('lodash'); 

exports.reserve = async (req,res) => {
	try{
		let query_string = "select * from RoomTable r \
	    where r.BuildID = ? and r.RoomID = ? \
	    and ((r.FinishTime >= ? and r.StartTime <= ?)\
	    or (r.Starttime <= ? and r.FinishTime >= ?))";

	  let val = [
	  	req.body.BuildID,
	  	req.body.RoomID,
	  	req.body.StartTime,
	  	req.body.FinishTime,
			req.body.StartTime,
	  	req.body.FinishTime,  	
	  ];

	  let select_result = await query(query_string, val);
	 	if( select_result.length == 0){

			query_string = "insert into RoomTable \
    		values(?,?,?,?,?,?)";

		  val = [
		  	req.body.BuildID,
		  	req.body.RoomID,
		  	req.body.StartTime,
		  	req.body.FinishTime,
				req.user.Fname,
		  	req.body.Objective,  	
		  ];

		  await query(query_string, val);
		  res.json({status:1});
	 	}

	 	else{
	 		res.json({status:2, message:"Overlap"});
	 	}
 	
	}catch(e){
		console.error(e);
		res.json({status:0});
	}
}


exports.table = async (req,res) => {
	try{
		let query_string = "select * from RoomTable r \
	    where r.BuildID = ? and r.RoomID = ? \
	    and ((r.FinishTime >= ? and r.StartTime <= ?)\
	    or (r.Starttime <= ? and r.FinishTime <= ?))\
	    ORDER BY r.StartTime ASC;";

	  let val = [
	  	req.body.BuildID,
	  	req.body.RoomID,
	  	req.body.StartTime,
	  	req.body.FinishTime,
			req.body.StartTime,
	  	req.body.FinishTime,  	
	  ];
 		
 		let select_result = await query(query_string, val);

 		res.json(select_result);

	}catch(e){
		console.error(e);
		res.json({status:0});
	}
}