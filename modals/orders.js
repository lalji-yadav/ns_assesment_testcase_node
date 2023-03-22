var mongoose = require('mongoose');
var validator = require('validator');
const { DELIVERED, DISPATCHED, PROCESSING } = require('./constant');
var  Schema = mongoose.Schema;


const orderSchema = Schema({
  orderByName:{
    type:String
  },
  orderByEmail:{
    type:String,
    validate(value) {
      if(!validator.isEmail(value)) {
          throw new Error('Email is  invalid')
      }
  }
  },
  orderByMobile:{
    type:Number
  },
  orderNumber:{
    type: Number
  }, 
  orderStatus: {
    type: String,
    enum: [DELIVERED, DISPATCHED,PROCESSING],
  },
  checklistFormId:{
    type:String
  },
  createdAt:{
    type: Date,
    default: Date.now 
  },
  updatedAt:{
    type: Date,
    default: Date.now 
  }
}
);

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
