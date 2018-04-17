module.exports = (app) => {
  const regist = require('../controllers/registration.controllers')
  app.get('/', regist.greeting);
  app.post('/register/result', regist.getRegisterResult);

	app.route('/register/process')
		.post(regist.processRequest)
		.delete(regist.deleteRegister);

  app.route('/register')
  .get(regist.getRequestResult)
  .post(regist.register)
  .delete(regist.delete);
}
