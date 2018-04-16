module.exports = () => {
    
    let bodyParser = require('body-parser');
    let morgan = require('morgan');
    let app = require('express')();

    app.use(morgan(':remote-addr :remote-user [:date[clf]] HTTP/:http-version" :method :url :status :res[content-length] - :response-time ms :user-agent'));

    app.use(bodyParser.urlencoded({
		limits: '10mb',
		extended: true
	}));
    app.use(bodyParser.json());

    require('../routes/registration.routes')(app)

    return app;
}