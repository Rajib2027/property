import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
    projectId: {
      type: String,
    
    },
    projectName: {
      type: String,
      
    },
    state: {
      type: String,
     
    },
    city: {
      type: String,
     
    },
    size: {
      type: String,
     
    },
   
    description: {
      type: String,
     
    },
    perUnitValue: {
      type: Number,
      
    },
    minIncrementAmount: {
      type:Number,
     
    },
    numOfUnits: {
      type: Number
     
    },
    assuredReturnValue: {
     type:String,
    },

    status:{
      type:Boolean,
      default:false,
    },

    lockInPeriod: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
  
  });
  
  const Investment = mongoose.model('Investment', investmentSchema);
  
  export default Investment;
  
  