module.exports = (app) => {
	let room = require('../controllers/room.controllers');
	const passport = require('passport');

	app.post('/room/reserve', passport.authenticate('bearer', { session: false }), room.reserve);	
	app.post('/room/table', room.table);
}
