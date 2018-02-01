'user stric'
const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const UserSchema = new Schema({
  name:   { type: String },
  surname:   { type: String },
  email:   { type: String },
  password:   { type: String },
  controllers:   { type: String },
  role: { type: String },
  image:   { type: String }
});

module.exports = mongoose.model('user', UserSchema);
