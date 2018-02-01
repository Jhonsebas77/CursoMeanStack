var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
var router = express.Router();
var port = process.env.PORT || 3977;
var UserCtrl = require('./Controllers/UserCtrl');
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

//router
var user = express.Router();

user.route('/users')
  .get(UserCtrl.pruebas);

user.route('/register')
  .post(UserCtrl.saveUser);

user.route('/login')
  .post(UserCtrl.loginUser);


app.use('/api', user);
