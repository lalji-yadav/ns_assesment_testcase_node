var mongoose = require('mongoose');
const { INSPECTIONMANAGERBYDONE, INSPECTIONMANAGERBYPROCESSING, PROCUREMENTMANAGERBYDONE,
      PROCUREMENTMANAGERBYPROCESSING, DRINKABLE,EATABLE,MEDICINE,OTHER} = require('./constant')
var  Schema = mongoose.Schema;


const checklistSchema = Schema({
  checklistId:{
    type:Number
  },
  productCategory:{
    type:String,
    enum:[DRINKABLE,EATABLE,MEDICINE,OTHER]
  },
  productAvailable:{
    type:Boolean
  },
  productFile:{
    type:Buffer
  },
  productDetails:{
    type:Array
  },
  productSummery:{
    type:String
  },
  statusByInspectionManager: {
    type:String,
    enum: [INSPECTIONMANAGERBYDONE, INSPECTIONMANAGERBYPROCESSING]
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

const ChecklistForm = mongoose.model('ChecklistForm', checklistSchema)
module.exports = ChecklistForm
