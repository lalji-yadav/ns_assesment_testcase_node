var mongoose = require('mongoose');
var validator = require('validator');
const { CLIENT, INSPECTIONMANAGER, PROCUREMENTMANAGER } = require('./constant');
var  Schema = mongoose.Schema;


const userSchema = Schema({
  name:{
    type:String
  },
  email:{
    type:String,
    unique: true,
    required: true,
    validate(value) {
      if(!validator.isEmail(value)) {
          throw new Error('Email is  invalid')
      }
  }
  },
  mobile:{
    type:Number,
    unique: true,
    required: true,
    validate(value){
      if(value<0){
        throw new Error('Mobile number will be positive')
      }
    }
  },
  password:{
    type: String,
    required: true
  }, 
  assignUnder:{
   type:String
  },
  role: {
    type: String,
    enum: [CLIENT, INSPECTIONMANAGER, PROCUREMENTMANAGER],
  },
  token: {
    type: String
  }, 
  createdAt:{
    type: Date,
    default: Date.now 
  },
  updatedAt:{
    type: Date,
    default: Date.now 
  }
},
);

const User = mongoose.model('User', userSchema)
module.exports = User
