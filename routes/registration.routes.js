module.exports = (app) => {
	const regist = require('../controllers/registration.controllers')

	app.get('/register/detail', regist.getDetail);
  app.get('/', regist.greeting);
  app.post('/register/result', regist.getRegisterResult);

	app.route('/register/process')
		.post(regist.processRequest)
		.delete(regist.deleteRegister);

	app.post('/register/add', regist.add);
	app.post('/register/remove', regist.remove);

  app.route('/register')
  .get(regist.getRequestResult)
  .post(regist.register)
  .delete(regist.delete);

}
