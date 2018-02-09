var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
var router = express.Router();
var port = process.env.PORT || 3977;
var UserCtrl = require('./Controllers/UserCtrl');
var md_auth=require('./middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload= multipart({uploadDir:'./uploads/users'});
/*
  Conexion a MongoDB por medio del servicio MongoLab
*/
mongoose.connect('mongodb://Sebastian:12345@ds111638.mlab.com:11638/otadb',(err,res)=>{
  if(err){
    console.log('ERROR: connecting to Database. ' + err);
  }  else {
    console.log("La conexion a la BD esta funcionando...");
    app.listen(port, function() {
      console.log("Node server running on http://localhost:"+port);
    });
  }
});

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(methodOverride());

/*
  Routes /api/
*/
var user = express.Router();

user.route('/user')
  .get(md_auth.ensureAuth,UserCtrl.pruebas);

user.route('/register')
  .post(UserCtrl.saveUser);

user.route('/login')
  .post(UserCtrl.loginUser);

user.route('/update-user/:id')
  .put(md_auth.ensureAuth,UserCtrl.updateUser);

user.route('/upload-avatar/:id')
  .post([md_auth.ensureAuth,md_upload],UserCtrl.uploadImage);

user.route('/get-avatar/:imageFile')
  .get(UserCtrl.getImageFile);

app.use('/api', user);
