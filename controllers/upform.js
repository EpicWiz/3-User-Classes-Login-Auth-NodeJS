const formidable = require('formidable');
const isAuthenticated = require('../config/middleware/isAuthenticated');
const fs = require('fs');
const path = require('path');
let db = require('../models');

module.exports = function(app) {

  app.post('/fileUpload', isAuthenticated, function(request, response) {
    if (request.user.kind !== 'arch') { response.redirect('/logout'); }

      let form = new formidable.IncomingForm();
      form.multiples = true;
      form.on('error', function(error) { console.log('An error has occured: \n' + error); });
      form.parse(request, function(error, fields, files) {
        form.uploadDir = path.join(__dirname, '/../uploads')
        let oldPath = files.filetoupload.path; //uploaded file path
        let oldName = files.filetoupload.name; //uploaded file name
        let extension = oldName.slice((Math.max(0, oldName.lastIndexOf(".")) || Infinity) + 1); //file extension
        let newPath = form.uploadDir + '/' + fields.fileName + '.' + extension; //new path --needs to be improved (potentially not unique)
        fs.rename(oldPath, newPath, function(error) {
          if (error) { console.log(error); throw error; }
          createDoc(fields.fileName + '.' + extension, extension, fields.client);
          console.log('File uploaded');
        });
      });

      function createDoc(path, extension, client) {
            db.Docs.create({
              path: path,
              fileType: extension,
              UserId: client
            }).then((data) => {
            response.redirect('/completeLogin');
          });
      }
  });

  app.get('/download/:fileName', isAuthenticated, function(request, response) {
    response.download('uploads/' + request.params.fileName);
  });

};
