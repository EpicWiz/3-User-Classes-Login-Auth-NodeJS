let isAuthenticated = require('../../config/middleware/isAuthenticated');
let db = require('../../models');

module.exports = function(app) {

  //GET CLIENT Contact Info --AND PROBABLY FILES TOO LATER
    app.get('/getClientData/:id', isAuthenticated, function(request, response) {
      Promise.all([
        db.Contact.findOne({
          where: {
            UserId: request.params.id
          },
          include: [{model: db.User}]
        }),
        db.Docs.findAll({
          where: {
            UserId: request.params.id
          }
        })
      ])
      .then((data) => {
        response.json(data);
      })
    });

//Navigate to Add-Client Page
  app.get('/addClientPage', isAuthenticated, function(request, response) {
    if (request.user.kind !== 'arch') { response.redirect('/logout'); }
    response.render('add-client');
  });

//Navigate to Arch-Settings
  app.get('/archSettings', isAuthenticated, function(request, response) {
    Promise.all([
      db.Contact.findOne({
        where: {
          UserId: request.user.id
        }
      })
    ]).then((data) => {
      let hbsObject = {
        contact: data[0]
      };
      response.render('settings', hbsObject);
    }).catch((error) => {
      console.log(error);
    })

  });

//Add new client
  app.post('/api/addClient', isAuthenticated, function(request, response) {
    if (request.user.kind !== 'arch') { response.redirect('/logout'); }
    Promise.all([
        db.User.create({
          email: request.body.email,
          password: request.body.password,
          kind: 'client',
          assoc: request.user.id
        })
    ])
    .then((data) => {
      Promise.all([
        db.User.findOne({
          where: {
            email: request.body.email
          }
        })
      ]).then((data) => {
        Promise.all([
          db.Contact.create({
            first_name:  request.body.first_name.trim(),
            last_name:  request.body.last_name.trim(),
            middle_name:  request.body.middle_name.trim(),
            addr_number:  request.body.addr_number.trim(),
            addr_street:  request.body.addr_street.trim(),
            apt_number: request.body.apt_number.trim(),
            zip_code:  request.body.zip_code.trim(),
            city:  request.body.city.trim(),
            state:  request.body.state.trim(),
            phone_number:  request.body.phone_number.trim(),
            UserId: data[0].id
          })
        ])
      })
      .then((data) => {
        response.redirect('/completeLogin');
      }).catch((error) => { console.log(error) });
    })
    .catch((error) => {
    console.log(error);
    });
  });

  app.put('/api/updateContact', isAuthenticated, function(request, response) {
    db.Contact.update({
      first_name:  request.body.first_name.trim(),
      last_name:  request.body.last_name.trim(),
      middle_name:  request.body.middle_name.trim(),
      addr_number:  request.body.addr_number.trim(),
      addr_street:  request.body.addr_street.trim(),
      apt_number: request.body.apt_number.trim(),
      zip_code:  request.body.zip_code.trim(),
      city:  request.body.city.trim(),
      state:  request.body.state.trim(),
      phone_number:  request.body.phone_number.trim()
    }, {
      where: {
        UserId: request.user.id
      }
    }).then((data) => {
      response.redirect('/');
    }).catch((error) => {
      console.log(error);
    });
  });

};

//*********************************************************
// Promise.all([db.findAll(tableA), db.findAll(tableB)])
// .then((data) => {
//    //data[0] is response from tableA find
//    // data[1] is from tableB
// })

//SELECT * FROM tableName ORDERBY ASC/DESC LIMIT 1
//let phone = request.body.phone_number.replace(/[^0-9]+/g, '');
