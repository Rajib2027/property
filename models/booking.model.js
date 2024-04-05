import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        numOfUnits: {
            type: Number
           
          },
          totalAmount: {
            type: Number,
          },
          projectName: {
            type: String,
            
          },
          status:{
            type:String,
            default:false,
          },
          userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
  
  export default Booking;






  