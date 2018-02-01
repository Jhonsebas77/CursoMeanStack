const bcrypt = require ('bcrypt-nodejs');
const User = require('../Models/user');

exports.pruebas = function(req,res){
  res.status(200).send({
    'message':'"Hola Mundo"',
  });
};
exports.saveUser=function(req,res){
  const user = new User();
  const params = req.body;

  console.log(params);

  user.name=params.name;
  user.surname=params.surname;
  user.email=params.email;
  user.role='ROLE_USER';
  user.image='null';

  if(params.password){
    bcrypt.hash(params.password,null,null,function(err,hash){
      user.password=hash;
      if(user.name != null && user.surname != null && user.email != null){
        user.save((err, userStored) =>{
          if (err){
            res.status(500).send({message:'Error al guardar el usuario'});
          }else{
            if(!userStored){
              res.status(404).send({message:'No se ha registrado el usuario'});
            }else{
              res.status(200).send({user:userStored});
            }
          }
        });
      }else{
        res.status(200).send({message:'Ingresa Todos los campos'});
      }
    });
  }else{
    res.status(200).send({message:'Introduce la Contrasena'});
  }
};
exports.loginUser= function(req,res){
  var params = req.body;
  var email = params.email;
  var password = params.password;

  User.findOne({email:email.toLowerCase()}, (err, user) => {
    if(err){
      res.status(500).send({message:'Error en la solicitud'});
    }else{
      if(!user){
        res.status(404).send({message:'No existe el usuario'});
      }else{
        bcrypt.compare(password,user.password, function(req,check) {
          if(check){
            if(params.gethash){

            }else{
              res.status(200).send({user});
            }
          }else{
            res.status(404).send({message:'El usuario no puede ingresar'});
          }
        });
      }
    }
  });
}
