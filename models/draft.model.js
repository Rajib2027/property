import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
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
    minimumIncrementAmount: {
      type:Number,
     
    },
    numberOfUnits: {
      type: Number
     
    },
    assuredReturnValue: {
     type:String,
    },
    lockinPeriod: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
  
  });
  
  const Draft = mongoose.model('Draft', draftSchema);
  
  export default Draft;
  
  