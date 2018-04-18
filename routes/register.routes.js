module.exports = (app) => {
	const register = require('../controllers/register.controllers')

  app.get('/', register.greeting);

	app.get('/register/detail', register.getDetail);

  app.post('/register/result', register.getRegisterResult);

	app.route('/register/process')
		.post(register.processRequest)
		.delete(register.deleteRegister);

	app.post('/register/add', register.add);
	app.delete('/register/remove', register.remove);
}
