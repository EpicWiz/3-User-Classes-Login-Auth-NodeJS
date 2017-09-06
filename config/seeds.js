let db = require('../models/');

module.exports = function() {

function first() {
  db.User.create({
    email: 'client@email.com',
    password: 'password',
    kind: 'client',
    assoc: 2
  }).then(function() {
    second();
  });
}

function second() {
  db.Contact.create({
    first_name:  'John',
    last_name:  'Doe',
    middle_name:  'J.',
    addr_number:  123,
    addr_street:  'Main',
    apt_number: 2,
    zip_code:  90210,
    city:  'Los Angeles',
    state:  'CA',
    phone_number:  5555555555,
    UserId: 1
  }).then(function() {
    third();
  });
}

function third() {
  db.User.create({
    email: 'arch@email.com',
    password: 'password',
    kind: 'arch'
  }).then(function() {
    fourth();
  });
}

function fourth() {
  db.Contact.create({
    first_name:  'Erlich',
    last_name:  'Bachman',
    middle_name:  'E.',
    addr_number:  42,
    addr_street:  'Wallaby Way',
    apt_number: 1,
    zip_code:  90210,
    city:  'Sydney',
    state:  'CA',
    phone_number:  3333333333,
    UserId: 2
  }).then(function() {
    fifth();
  });
}

function fifth() {
  db.User.create({
    email: 'admin@email.com',
    password: 'password',
    kind: 'admin'
  }).then(function() {
    console.log('success');
  });
}

first();

};
