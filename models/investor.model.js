import mongoose from "mongoose";

const investorSchema = new mongoose.Schema({
  investorId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  doa: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  referredBy: {
   type:String,
  },
  referenceId: {
    type: String,
  },
  canIntroduce: {
    type: Boolean,
  },
  dateOfEntry: {
    type: Date,
   
  },

});

const Investor = mongoose.model('Investor', investorSchema);

export default Investor;

