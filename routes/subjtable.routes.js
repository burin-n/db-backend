module.exports = (app) => {
	const request = require('../controllers/subjtable.controllers');
	const passport = require('passport');

  app.post('/subjtable',passport.authenticate('bearer', { session: false }),request.getTable);
  //app.delete('/request',passport.authenticate('bearer', { session: false }),request.deleteRequest);
  //app.post('/request/result',passport.authenticate('bearer', { session: false }),request.getRequestResult);

}
