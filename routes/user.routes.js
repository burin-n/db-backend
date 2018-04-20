module.exports = function( app ) {
	const user = require('../controllers/user.controllers');
	let passport = require('passport');

	app.post('/login', user.login);
	app.get('/logout', passport.authenticate('bearer', { session: false }), user.logout);
	app.get('/profile', passport.authenticate('bearer', { session: false }), user.profile);

}

