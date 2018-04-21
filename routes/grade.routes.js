module.exports = (app) => {
	let grade = require('../controllers/grade.controllers');
	let passport = require('passport');

	app.get('/grade',passport.authenticate('bearer', { session: false }), grade.compute);
}