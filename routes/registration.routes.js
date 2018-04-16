module.exports = (app) => {
    const regist = require('../controllers/registration.controllers')
    app.get('/', regist.greeting);
    app.route('/regist')
    .get(regist.getResults)
    .post(regist.register);
}