module.exports = (app) => {
	const request = require('../controllers/request.controllers')

	app.route('/request')
  .post(request.makeRequest)
  .delete(request.deleteRequest);

  app.post('/request/result',request.getRequestResult);

}
