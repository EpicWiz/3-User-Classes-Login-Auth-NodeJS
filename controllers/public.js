module.exports = function(app) {

  app.get('/', function(request, response) {
    if (request.user) {
      if (request.user.kind === 'arch') {
        response.redirect('/completeLogin');
      } else if (request.user.kind === 'client') {
        response.redirect('/completeLogin');
      } else if (request.user.kind === 'admin') {
        response.redirect('/completeLogin');
      }
    } else {
      response.render('index');
    }
  });

  app.get('/login', function(request, response) {
    if (request.user) {
      if (request.user.kind === 'arch') {
        response.redirect('/completeLogin');
      } else if (request.user.kind === 'client') {
        response.redirect('/completeLogin');
      } else if (request.user.kind === 'admin') {
        response.redirect('/completeLogin');
      }
    } else {
      response.render('login');
    }
  });

};
