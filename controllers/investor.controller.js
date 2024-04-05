import Investor from "../models/investor.model.js";
import _ from 'lodash'; // Import lodash for more readable and efficient filtering
import Draft from "../models/draft.model.js";
import Investment from "../models/investment.model.js";
import mongoose from 'mongoose';
import { errorHandler } from "../utils/error.js";
import nodemailer from 'nodemailer'
import Booking from "../models/booking.model.js";
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs'

export const createInvestor = async (req, res, next) => {
  try {
    // Create investor in Investor model
    const investor = await Investor.create(req.body);
    
    // Extract investor information
    const { name, email, mobile } = investor;
    
    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8); // Generates an 8-character random string
    
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

    // Create user in User model
    const user = await User.create({
      username: name,
      email,
      mobile,
      password: hashedPassword, // Save the hashed password
      role: "investor",
    });
 // Send email to user with password
 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajiblochanpanda2027@gmail.com',
    pass: 'usblzapfovjyjody',
  },
});

const mailOptions = {
  from: 'rajiblochanpanda2027@gmail.com',
  to: email,
  subject: 'Your Password',
  text: `Your password is: ${randomPassword}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});






    // Return the created investor
    return res.status(201).json({ investor, user });
  } catch (error) {
    // Handle errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

export const getAllInvestors = async (req, res, next) => {
  try {
    const investors = await Investor.find();
    return res.status(200).json(investors);
  } catch (error) {
    // Handle errors, and pass to the error handler middleware
    next(error);
  }
};


export const draft = async (req, res) => {
  const draftData = req.body;

  try {
    // Create a new Project instance and save it to the database
    const newProject = new Draft(draftData);
    await newProject.save();

    console.log('Form data saved in the database:', draftData);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving form data:', error.message);
    res.status(500).send('Internal Server Error');
  }
};


export const allDraft =  async (req, res) => {
  try {
    const drafts = await Draft.find();
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

export const fetchDraft = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const draft = await Draft.findOne({ projectId });

    if (!draft) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }

    res.json({ success: true, draft });
  } catch (error) {
    console.error("Error fetching draft:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const search = async (req, res) => {
  try {
    const { investorId, name, mobile, email, whatsapp, dob, doa, dateOfEntry, referredBy } = req.query;

    let query = {};

    if (investorId) {
      query.investorId = { $regex: new RegExp(investorId, 'i') };
    }

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }

    if (mobile) {
      query.mobile = { $regex: new RegExp(mobile, 'i') };
    }

    if (email) {
      query.email = { $regex: new RegExp(email, 'i') };
    }

    if (whatsapp) {
      query.whatsapp = { $regex: new RegExp(whatsapp, 'i') };
    }

    if (dob) {
      query.dob = { $regex: new RegExp(dob, 'i') };
    }

    if (doa) {
      query.doa = { $regex: new RegExp(doa, 'i') };
    }

    if (dateOfEntry) {
      query.dateOfEntry = { $regex: new RegExp(dateOfEntry, 'i') };
    }

    if (referredBy) {
      query.referredBy = { $regex: new RegExp(referredBy, 'i') };
    }

    const searchResults = await Investor.find(query);

    console.log('Final Search Results:', searchResults);

    res.json(searchResults);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const createInvestment =  async (req, res) => {
  try {
    // Retrieve form data from the request body
    const formData = req.body;

    // Save the form data as a draft
    const savedDraft = await  Investment.create(formData);

    console.log('Draft saved successfully:', savedDraft);

    // Send a response to the client
    res.status(200).json({ success: true, message: 'Draft saved successfully' });
  } catch (error) {
    console.error('Error saving draft:', error.message);
    res.status(500).json({ success: false, message: 'Failed to save draft' });
  }
};



export const deleteDraft = async (req, res) => {
  const projectId = req.params.projectId;

  try {
    // Find the draft by projectId and delete it
    const deletedDraft = await Draft.findOneAndDelete({ projectId });

    if (deletedDraft) {
      res.status(200).json({ success: true, message: 'Draft deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Draft not found' });
    }
  } catch (error) {
    console.error('Error deleting draft:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllInvestment = async (req, res) => {
  try {
    const investments = await Investment.find();
    res.status(200).json({ success: true, investments });
  } catch (error) {
    console.error('Error fetching investments:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};







export const getInvestment = async (req, res, next) => {
  try {
    const investmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(investmentId)) {
      return next(errorHandler(400, 'Invalid investment ID'));
    }

    const investor = await Investment.findById(investmentId);

    if (!investor) {
      return next(errorHandler(404, 'Investor not found!'));
    }

    const response = {
      projectName: investor.projectName,
      state: investor.state,
      city: investor.city,
      district: investor.district,
      pin: investor.pin,
      size: investor.size,
      description: investor.description,
      perUnitValue: investor.perUnitValue,
      minIncrementAmount: investor.minIncrementAmount,
      assuredReturnValue: investor.assuredReturnValue,
      lockInPeriod: investor.lockInPeriod,
      totalAmount: investor.totalAmount,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Modify the getAllInvestorEmails function to return the array of emails directly
export const getAllInvestorEmails = async () => {
  try {
    const investors = await Investor.find();
    return investors.map((investor) => investor.email);
  } catch (error) {
    console.error('Error fetching investor emails:', error);
    throw new Error('Internal Server Error');
  }
}

// Modify the sendInvestmentEmail function to use the fetched investor emails
export const sendInvestmentEmail = async (investmentId) => {
  try {
    const investorEmails = await getAllInvestorEmails();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rajiblochanpanda2027@gmail.com',
        pass: 'usblzapfovjyjody',
      },
    });

    const link = `http://localhost:5173/investment/${investmentId}`;

    const mailOptions = {
      from: 'rajiblochanpanda2027@gmail.com',
      to: investorEmails.join(', '),
      subject: 'New Investment Published',
      html: `Check out the new investment: <a href="${link}">${link}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending investment email:', error.message);
    return {
      success: false,
      message: 'Error sending investment email',
    };
  }
};



// Modify the send function to handle investmentId as a route parameter
export const send = async (req, res) => {
  const { investmentId } = req.params;

  try {
    const result = await sendInvestmentEmail(investmentId);

    if (result.success) {
      // Update investment model status to true
      await Investment.findByIdAndUpdate(investmentId, { status: true });

      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






export const boookInvest = async (req, res, next) => {
  try {
    // Check if the combination of user and investment already exists
    const existingBooking = await Booking.findOne({
      userRef: req.body.userRef,
      // Add other criteria if needed, based on your model
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'User already booked for this investment' });
    }

    // If not exists, create the booking with the updated status
    const listing = await Booking.create({ ...req.body });

    return res.status(201).json({ success: true, message: 'Investor details updated successfully!', data: listing });
  } catch (error) {
    // Handle specific errors and send appropriate responses
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    // Handle other types of errors as needed
    next(error);
  }
};




export const allInvest =  async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userRef', 'username email mobile');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const individualInvest =async (req, res) => {
  try {
    // Extract userId from the request parameters
    const userId = req.params.userId;

    console.log('userId:', userId);

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find bookings by userId
    const bookings = await Booking.findOne({ userRef: userObjectId });

    if (!bookings) {
      console.log('No bookings found for userId:', userId);
      return res.status(404).json({ error: 'No bookings found for the user' });
    }

    console.log('bookings:', bookings);

    res.json(bookings);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 



export const allInvestment = async (req, res) => {
  try {
    const investments = await Investment.find({ status: true });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
