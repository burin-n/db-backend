module.exports = () => {
    
  let bodyParser = require('body-parser');
  let morgan = require('morgan');
  let app = require('express')();
	let cors = require('cors');

  app.use(morgan(':remote-addr :remote-user [:date[clf]] HTTP/:http-version" :method :url :status :res[content-length] - :response-time ms :user-agent'));

	app.use(cors());
  app.use(bodyParser.urlencoded({
		limits: '10mb',
		extended: true
	}));

	app.use(bodyParser.json());

	require('../routes/register.routes')(app)
	require('../routes/request.routes')(app)
	require('../routes/user.routes')(app)
	require('../routes/room.routes')(app)
	require('../routes/grade.routes')(app)
	require('../routes/subjtable.routes')(app)

	return app;
}
