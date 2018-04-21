module.exports = (app) => {
	const request = require('../controllers/subjtable.controllers');
	const passport = require('passport');

  app.post('/table/subj',passport.authenticate('bearer', { session: false }),request.getSubjTable);
  app.post('/table/mid',passport.authenticate('bearer', { session: false }),request.getMidTable);
  //app.post('/table/fin',passport.authenticate('bearer', { session: false }),request.getFinTable);
  //app.delete('/request',passport.authenticate('bearer', { session: false }),request.deleteRequest);
  //app.post('/request/result',passport.authenticate('bearer', { session: false }),request.getRequestResult);

}
