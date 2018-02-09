const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_Secreta_Curso';

exports.ensureAuth = function(req,res,next){
   if(!req.headers.authorization){
     return res.status(403).send({message:'La peticion no tiene la autenticacion'})
   }

   var token= req.headers.authorization.replace(/['"]+/g,'');

   try{
      var payload= jwt.decode(token,secret);
      if (payload.exp <= moment().unix()){
        return res.status(401).send({message:'Token Expirado'});
      }
   }catch(ex){
     return res.status(404).send({message:'Token No Valido'});
   }

   req.user = payload;

   next();
};
