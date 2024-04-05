import mongoose from "mongoose";


const referalsSchema = new mongoose.Schema({
    name: String,
    contactNumber: String,
    alternativeContact: String,
    state: String,
    city: String,
    pin: String,
    district: String,
    
    pan: [], // Store the file buffer directly
    aadhar: [], // Store the file buffer directly
    code:{
      type: String,
      default:"NA",
    },
    userRef:String,
      status: {
        type: String,
        enum: ["Active", "Hold", "InActive","Pending"],
        default: "Pending",
      },
  });

  const Referals = mongoose.model("Referals", referalsSchema);

export default Referals;
   