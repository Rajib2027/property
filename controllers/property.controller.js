import Image from "../models/image.model.js";
import Property from "../models/property.model.js";
import User from "../models/user.model.js";
import { errorHandler } from '../utils/error.js';
import moment from 'moment';



export const getAll = async (req, res) => {
  try {
    // Fetch properties with status set to true
    const properties = await Property.find({ status: true });

    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const approval = async (req, res) => {
  try {
    const propertiesToApprove = await Property.find({ status: false });
    res.json(propertiesToApprove);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}




export const featured = async (req, res) => {
  try {
    const featuredProperties = await Property.find({ featured: true })
    return res.status(200).json(featuredProperties);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


//specific type
export const find = async (req, res) => {
  const type = req.query;
  try {
    if (type) {
      const properties = await Property.find(type)
      return res.status(200).json(properties);
    } else {
      return res.status(500).json({ msg: "No such type" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


export const findType = async (req, res) => {
  try {
    const residentialType = await Property.countDocuments({
      type: "residential",
    });
    const commercialType = await Property.countDocuments({
      type: "commercial",
    });
    const farmHousePentHouseType = await Property.countDocuments({
      type: "farmHouse",
    });
    const agriculturalLandType = await Property.countDocuments({
      type: "agriculturalLand",
    });
    const flatType = await Property.countDocuments({ type: "flat" });
    const duplexType = await Property.countDocuments({ type: "duplex" });
    const coreHouseType = await Property.countDocuments({ type: "coreHouse" });
    const commercialBuildingType = await Property.countDocuments({
      type: "commercialBuilding",
    });
    const projectsType = await Property.countDocuments({ types: "projects" });
    const leasePlotsType = await Property.countDocuments({
      types: "leasePlots",
    });
    const wareHouseType = await Property.countDocuments({ types: "wareHouse" });

    return res.status(200).json({
      residential: residentialType,
      commercial: commercialType,
      farmHouse: farmHousePentHouseType,
      agriculturalLand: agriculturalLandType,
      flat: flatType,
      duplex: duplexType,
      coreHouse: coreHouseType,
      commercialBuilding: commercialBuildingType,
      projects: projectsType,
      leasePlots: leasePlotsType,
      wareHouse: wareHouseType,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


export const individualProperty = async (req, res, next) => {
  try {
    const properties = await Property.find({ userRef: req.params.id }); // Use req.params.id to get the parameter from the URL

    return res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Handle the error and return a proper response
  }
};


export const getListing = async (req, res, next) => {
  try {
    const listing = await Property.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Fetch user details separately based on userRef ID
    const user = await User.findById(listing.userRef).select('username email mobile');

    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    // Include additional details in the response
    const response = {
      title: listing.title,
      imgUrls:listing.imgUrls,
      type: listing.type,
      desc: listing.desc,
      features:listing.features,
      price: listing.price,
      sqrmeter: listing.sqrmeter,
      sqrfeet:listing.sqrfeet,
      decimil:listing.decimil,
      propertyType:listing.propertyType,
      
minBookingAmount:listing.minBookingAmount,
propertyName:listing.propertyName,



      
      state: listing.state,
      city: listing.city,
      district: listing.district,
      pin: listing.pin,
      additionalFields: listing.additionalFields.map(field => ({
        type: field.type,
        size: field.size,
        units: field.units,
        price: field.price,
        category:field.category,
        status: field.status,
        superbuiltup: field.superbuiltup,
      builtup:field.builtup,
      carpetarea:field.carpetarea,
        subtypes: field.subtypes.map(subtype => ({
          type: subtype.type,
          category: subtype.category,
          size: subtype.size,
          units: subtype.units,
          price: subtype.price,
          status: subtype.status,
          superbuiltup: subtype.superbuiltup,
          builtup:subtype.builtup,
          carpetarea:subtype.carpetarea,
        })),
      })),
      user: user.toJSON(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};



















export const getProjectView = async (req, res, next) => {
  try {
    const listing = await Property.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};


export const propertyType = async (req, res) => {
  try {
    // Extract the enum values from the property schema
    const propertyTypes = Property.schema.path('type').enumValues;

    // Return the property types as a JSON response
    return res.status(200).json(propertyTypes);
  } catch (error) {
    // Handle any errors and return a 500 status with the error message
    return res.status(500).json({ error: error.message });
  }
};

 

export const createProperty = async (req, res, next) => {
  try {
    // Fetch user details using the current user ID
    const userId = req.user && req.user.id; // Assuming user ID is available in req.user
    console.log(userId)
    // Check if the role is admin
    const user = await User.findById(userId);
    const isAdmin = user && user.role === 'admin';
console.log(isAdmin)
    // Set the status based on the role
    const status = isAdmin ? true : false;
console.log(status)
    // Create the property with the updated status
    const listing = await Property.create({ ...req.body, status });

    return res.status(201).json(listing);
  } catch (error) {
    // Handle specific errors and send appropriate responses
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    // Handle other types of errors as needed
    next(error);
  }
};




export const createProject = async (req, res, next) => {
  try {
   const status = true
    const listing = await Property.create({ ...req.body , status});

    return res.status(201).json(listing);
  } catch (error) {
    // Handle specific errors and send appropriate responses
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    // Handle other types of errors as needed
    next(error);
  }
};

export const changeProjectStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if propertyId is missing
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is missing in the request parameters' });
    }

    const { status, fieldIndex, subtypeIndex } = req.body;

    // Validate status, fieldIndex, and subtypeIndex
    const allowedStatusValues = ['Available', 'Booked', 'SoldOut'];
    if (!allowedStatusValues.includes(status)) {
      return res.status(400).json({ error: `Invalid status value. It should be one of: ${allowedStatusValues.join(', ')}` });
    }
    if (typeof fieldIndex !== 'number' || typeof subtypeIndex !== 'number') {
      return res.status(400).json({ error: 'Field index and subtype index must be valid numbers' });
    }

    // Find the property by ID
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: `Property with ID ${propertyId} not found` });
    }

    // Ensure that fieldIndex is within the valid range
    if (fieldIndex < 0 || fieldIndex >= property.additionalFields.length) {
      return res.status(400).json({ error: 'Invalid field index' });
    }

    // Ensure that subtypeIndex is within the valid range
    if (subtypeIndex < 0 || subtypeIndex >= property.additionalFields[fieldIndex].subtypes.length) {
      return res.status(400).json({ error: 'Invalid subtype index' });
    }

    // Update the status of the specified subtype
    property.additionalFields[fieldIndex].subtypes[subtypeIndex].status = status;

    // Update the property with the modified additionalFields
    const updatedProperty = await property.save();

    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const updateProperty = async (req,res)=>{
    try {
        const property = await Property.findById(req.params.id)
        if (property.currentOwner !== req.user.id) {
            throw new Error ("You are not allowed to update other people property")
        } else {
            const updateProperty = await Property.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new : true}
            )
            return res.status(200).json(updateProperty)
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
}


export const deleteProperty = async (req,res)=>{
    try {
        const property = await Property.findById(req.params.id)
    if (property.currentOwner !== req.user.id) {
        throw new Error ("You are not allowed to delete other people properties")
    } else {
        await property.delete()
       return res.status(200).json({msg:'Successfully deleted property'})
    }

    } catch (error) {
        return res.status(500).json(error.message);
    }
}



export const getAllPropertyLocations = async (req, res) => {
  try {
    // Fetch all properties from the database
    const allProperties = await Property.find();

    // Extract states, districts, cities, and pins from all properties
    const propertyDetails = allProperties.map(property => ({
      state: property.state,
      district: property.district,
      city: property.city,
      pin: property.pin,
    }));

    // Return the details as a JSON response
    return res.status(200).json(propertyDetails);
  } catch (error) {
    // Handle any errors and return a 500 status with the error message
    return res.status(500).json({ error: error.message });
  }
};



export const filter = async (req, res) => {
  try {
    const {
      type,
      sizeUnit,
      sqrmeter,
      sqrfeet,
      decimil,
      minPrice,
      maxPrice,
      state,
      city,
      district,
      pin,
    } = req.body;

    let queries = [];

    if (type) queries.push({ type });

    const minRange = parseFloat(sqrmeter) - 200 || parseFloat(sqrfeet) - 200 || parseFloat(decimil) - 200;
    const maxRange = parseFloat(sqrmeter) + 200 || parseFloat(sqrfeet) + 200 || parseFloat(decimil) + 200;

    const range = { $gte: minRange, $lte: maxRange };

    if (parseFloat(sqrfeet) > 0) {
      queries.push({ sqrfeet: range });
    } else if (parseFloat(sqrmeter) > 0) {
      queries.push({ sqrmeter: range });
    } else if (parseFloat(decimil) > 0) {
      queries.push({ decimil: range });
    }

    if (minPrice || maxPrice) queries.push({ price: { $gte: minPrice, $lte: maxPrice } });

    if (state) queries.push({ state });
    if (city) queries.push({ city });
    if (district) queries.push({ district });
    if (pin) queries.push({ pin });

    // Add condition for status being true
    queries.push({ status: true });

    const filteredData = await Property.find({ $and: queries });
    console.log('Filtered Data:', filteredData);

    res.json(filteredData);
  } catch (error) {
    console.error('Error filtering properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const check= async (req, res) => {
  try {
    const properties = await Property.find({ sqrfeet: 200 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



export const bookedProperty = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the property is already in bookedProperties
    const isBooked = user.bookedProperties.includes(listingId);
    if (isBooked) {
      return res.json({ success: false, message: 'Property is already booked by the user' });
    }

    // Find the property by listingId
    const property = await Property.findById(listingId);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Add the property to bookedProperties
    user.bookedProperties.push(listingId);
    await user.save();

    return res.json({ success: true, message: 'Property added to bookedProperties successfully' });
  } catch (error) {
    console.error('Error adding property to bookedProperties:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const getBookedProperty = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findById(userId).populate('bookedProperties');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Extract booked properties information
    const bookedProperties = user.bookedProperties.map(property => {
      return {
        id: property._id,
        type: property.type,
        title: property.title,
        image:property.imgUrls,

        // Add other property fields as needed
      };
    });

    return res.json({ success: true, bookedProperties });
  } catch (error) {
    console.error('Error fetching booked properties:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export const getSize = async (req, res) => {
  try {
    const properties = await Property.find({}, 'sqrfeet sqrmeter decimil');
    res.json(properties);
  } catch (error) {
    console.error('Error fetching property data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const addUrl = async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty array of image URLs' });
    }

    // Delete all existing images
    await Image.deleteMany({});

    // Insert new images
    const newImages = await Image.insertMany(urls.map(url => ({ url })));

    res.status(201).json({ message: 'Images added successfully', images: newImages });
  } catch (error) {
    console.error('Error adding images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getAllStatusChanged =  async (req, res) => {
  try {
    // Find properties where statusChangedAt field is present
    const properties = await Property.find({ statusChangedAt: { $exists: true } })
      .sort({ statusChangedAt: -1 }); // Sorting from new to old

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const getUrls = async (req, res) => {
  try {
    const imageUrls = await Image.find().select('url');
    res.json(imageUrls.map(image => image.url));
  } catch (error) {
    console.error('Error fetching image URLs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const changeStatus = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { status } = req.body;
    
    
    // Update the property with status and timestamp
    const property = await Property.findByIdAndUpdate(
      listingId,
      {
        $set: {
          status: status,
          statusChangedAt: moment().toISOString(), // Use moment to get current timestamp
        },
      },
      { new: true }
    );

    if (property) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const hold = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { hold } = req.body;
    
    
    // Update the property with status and timestamp
    const property = await Property.findByIdAndUpdate(
      listingId,
      {
        $set: {
          hold: hold,
        },
      },
      { new: true }
    );

    if (property) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const sold = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { sold } = req.body;
    
    
    // Update the property with status and timestamp
    const property = await Property.findByIdAndUpdate(
      listingId,
      {
        $set: {
          sold: sold,
        },
      },
      { new: true }
    );

    if (property) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getProject = async (req, res) => {
  try {
    const properties = await Property.find({
      additionalFields: { $exists: true, $not: { $size: 0 } }
    });

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};













