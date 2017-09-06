let isAuthenticated = require('../../config/middleware/isAuthenticated');
let db = require('../../models');

module.exports = function(app) {

app.put('/comment/:id', isAuthenticated, function(req, res){
  console.log('HERE WE GO');
  db.Docs.update({
    comment: req.body.comment
  }, {
    where: {
      id: req.params.id
    }
  }).then((data) => {
    res.redirect('/completeLogin');
  }).catch((error) => {
    console.log(error);
  })
});

};
