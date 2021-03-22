const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Register = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const Login = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('AuthRegister', Register)
module.exports = mongoose.model('AuthLogin', Login)