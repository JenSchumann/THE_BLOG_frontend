const mongoose = require('mongoose');
const Author = require('./authors.js');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})





module.exports = mongoose.model('UserSchema', UserSchema)
