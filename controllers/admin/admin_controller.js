let isAuthenticated = require('../../config/middleware/isAuthenticated');
let db = require('../../models');

module.exports = function(app) {

  //GET User Contact Info
    app.get('/getUserData/:id', isAuthenticated, function(request, response) {
      if (request.user.kind !== 'admin') { response.redirect('/logout'); }
        db.Contact.findOne({
          where: {
            UserId: request.params.id
          },
          include: [{model: db.User}]
        })
      .then((data) => {
        console.log('THIS IS THE GOODS ' + JSON.stringify(data));
        response.json(data);
      })
    });

//Go to Add Architect Page
    app.get('/adminAddArch', isAuthenticated, function(request, response) {
      if (request.user.kind !== 'admin') { response.redirect('/logout'); }
      response.render('admin-arch');
    });

//Go to Add Client Page
    app.get('/adminAddClient', isAuthenticated, function(request, response) {
      if (request.user.kind !== 'admin') { response.redirect('/logout'); }
      db.User.findAll({
        where: {
          kind: 'arch'
        },
        include: [{model: db.Contact}]
      }).then((data) => {
        let hbsObject = {
          arch: data
        };
        response.render('admin-client', hbsObject);
      }).catch((error) => {
        console.log(error);
      });
    });

//Go to Add Admin Page
  app.get('/adminAddAdmin', isAuthenticated, function(request, response) {
    if (request.user.kind !== 'admin') { response.redirect('/logout'); }
    response.render('admin-admin');
  });

    //Add new arch
    app.post('/api/admin/addArch', isAuthenticated, function(request, response) {
      if (request.user.kind !== 'admin') { response.redirect('/logout'); }
      Promise.all([
          db.User.create({
            email: request.body.email,
            password: request.body.password,
            kind: 'arch',
            assoc: 0
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

      app.post('/api/admin/addClient', isAuthenticated, function(request, response) {
        if (request.user.kind !== 'admin') { response.redirect('/logout'); }
        Promise.all([
            db.User.create({
              email: request.body.email,
              password: request.body.password,
              kind: 'client',
              assoc: request.body.assoc
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

//Add new Administrator
  app.post('/api/admin/addAdmin', isAuthenticated, function(request, response) {
    if (request.user.kind !== 'admin') { response.redirect('/logout'); }
    db.User.create({
      email: request.body.email,
      password: request.body.password,
      kind: 'admin'
    }).then((data) => {
      response.redirect('/completeLogin');
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
