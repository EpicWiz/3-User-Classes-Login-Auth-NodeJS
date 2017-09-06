const express = require('express');
const bodyParser = require('body-parser');
const methOver = require('method-override');
const expHbars = require('express-handlebars');
const session = require('express-session');
const passport = require('./config/passport.js');
const db = require('./models'); //MODELS

const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

//express static -where you get your static files (css, js, images, etc...)
app.use(express.static('./assets')); //

//bodyParser - parsing responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

//express sessions - manage user login sessions
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//method override for put/delete
app.use(methOver('_method'));

//exp-handlebars
app.engine('handlebars', expHbars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//controllers
require('./controllers/auth.js')(app);
require('./controllers/public.js')(app);
require('./controllers/client/client_controller.js')(app);
require('./controllers/arch/arch_controller.js')(app);
require('./controllers/admin/admin_controller.js')(app);
require('./controllers/upform.js')(app);

db.sequelize.sync({force: true}).then(function() {
  app.listen(PORT, function() {
    console.log('Listening on port: ' + PORT);
    require('./config/seeds.js')();
  });
});
