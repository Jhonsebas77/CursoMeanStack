
const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'Clave_Secreta_Curso';

exports.createToken = function (user) {
  const { _id = '', name = '', surname = '', email = '', role = '', image = '' } = { ...user }
  const payload = {
    sub: _id, name, surname, email, role, image,
    iat: moment().unix,
    exp: moment().add(30, 'days').unix,
  };
  return jwt.encode(payload, secret);
};
