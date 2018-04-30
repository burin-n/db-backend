module.exports = (app) => {
	let ann = require('../controllers/announcement.controllers');

	app.get('/announcement', ann.getAnnounce);
}