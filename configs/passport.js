
module.exports = () => {

	let passport = require('passport')
		, Strategy = require('passport-http-bearer').Strategy;
	let db = require('./mysql').database;

	passport.use(new Strategy(
		function(token, done) {
			const query_string = "select * from StudentUser U, Student S \
														where U.token = ? and U.SID = S.SID";
		
			db.query(query_string, [token], (err,result) => {
				if(err)
					done(new Error("Internal Error"));
				else if( result.length == 0 ){
					done(null, null);	
				}
				else{
					result = result[0];
					result.password = undefined;
					done(null, result);
				}
			});
		}
	));
}
