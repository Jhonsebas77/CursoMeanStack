'user stric'
const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const ArtistSchema = new Schema({
  name:   { type: String },
  description:   { type: String },
  image:   { type: String },
});

module.exports = mongoose.model('artist', ArtistSchema);
