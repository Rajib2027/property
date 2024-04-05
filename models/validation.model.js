import mongoose from "mongoose";



    const otpSchema = new mongoose.Schema({
        userOtps: {
          type: Map,
          of: String,
        },
      });


const OtpModel = mongoose.model('Otp', otpSchema);

export default OtpModel