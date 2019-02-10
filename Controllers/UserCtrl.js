const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const User = require('../Models/user');
const jwt = require('../services/jwt');

exports.pruebas = function (req, res) {
  res.status(200).send({
    'message': '"Hola Mundo"',
  });
};
exports.saveUser = function (req, res) {
  const user = new User();
  const { name, surname, email, password } = { ...req.body };
  user.name = name;
  user.surname = surname;
  user.email = email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if (password) {
    bcrypt.hash(password, null, null, function (err, hash) {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: 'Error al guardar el usuario' });
          } else {
            if (!userStored) {
              res.status(404).send({ message: 'No se ha registrado el usuario' });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: 'Ingresa Todos los campos' });
      }
    });
  } else {
    res.status(500).send({ message: 'Introduce la Contrasena' });
  }
};
exports.loginUser = function (req, res) {
  const { email = '', password, gethash } = { ...req.body }

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error en la solicitud' });
    } else {
      if (!user) {
        res.status(404).send({ message: 'No existe el usuario' });
      } else {
        bcrypt.compare(password, user.password, function (req, check) {
          if (check) {
            if (gethash) {
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res.status(404).send({ message: 'El usuario no puede ingresar' });
          }
        });
      }
    }
  });
}
exports.saveAdmin = function (req, res) {
  let user = new User();
  const { name, surname, email, password } = { ...req.body };
  user.name = name;
  user.surname = surname;
  user.email = email;
  user.role = 'ROLE_ADMIN';
  user.image = 'null';

  if (password) {
    bcrypt.hash(password, null, null, function (err, hash) {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: 'Error al guardar el Administrador' });
          } else {
            if (!userStored) {
              res.status(404).send({ message: 'No se ha registrado el Administrador' });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: 'Ingresa Todos los campos' });
      }
    });
  } else {
    res.status(200).send({ message: 'Introduce la Contrasena' });
  }
};
exports.updateUser = function (req, res) {
  const userId = req.params.id;
  const update = req.body;
  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Error al actualizar el usuario' });
    } else {
      if (!userUpdated) {
        res.status(400).send({ message: 'No se ha podido actualizar el usuario' })
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
};
exports.uploadImage = function (req, res) {
  const userId = req.params.id;
  const file_name = 'Sin Imagen';

  if (req.files) {
    const file_path = req.files.image.path;
    const file_split = file_path.split('/');
    const file_name = file_split[2];
    const ext_split = file_name.split('.');
    const file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
        if (err) {
          res.status(500).send({ message: 'Error al actualizar la imagen' });
        } else {
          if (!userUpdated) {
            res.status(400).send({ message: 'No se ha podido actualizar la imagen' })
          } else {
            res.status(200).send({ user: userUpdated });
          }
        }
      });
    } else {
      res.status(200).send({ message: 'Tipo de archivo no valido' });
    }

  } else {
    res.status(200).send({ message: 'No ha subido ninguna imagen' });
  }
};
exports.getImageFile = function (req, res) {
  const imageFile = req.params.imageFile;
  const path_file = './uploads/users/' + imageFile;
  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: 'No Existe la imagen' });
    }
  });
}
