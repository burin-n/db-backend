const query = require('../configs/mysql').query;
const _ = require('lodash');

exports.getAnnounce = async (req,res) => {
  const query_string = "select * from Announcement";
  try{
    result = await query(query_string);
    res.json({status:1,result}); 
  }catch(e){
    res.status(500).json({status:0});
  }
}