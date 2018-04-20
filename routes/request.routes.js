module.exports = (app) => {
	const request = require('../controllers/request.controllers');
	const passport = require('passport');

  app.post('/request',passport.authenticate('bearer', { session: false }),request.makeRequest);
  app.delete('/request',passport.authenticate('bearer', { session: false }),request.deleteRequest);
  app.post('/request/result',passport.authenticate('bearer', { session: false }),request.getRequestResult);

}
