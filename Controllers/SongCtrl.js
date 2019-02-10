const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination')
const Artist = require('../Models/artist');
const Album = require('../Models/album');
const Song = require('../Models/song');

exports.getSong = function (req, res) {
  const songId = req.params.id;
  Song.findById(songId).populate({ path: 'artist' }).exec((err, album) => {
    if (err) {
      res.status(500).send({ message: 'Error  en la peticion' });
    } else {
      if (!album) {
        res.status(404).send({ message: 'El Album no existe' });
      } else {
        res.status(200).send({ album });
      }
    }
  });
};
