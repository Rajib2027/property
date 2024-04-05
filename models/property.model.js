import mongoose from "mongoose";


const propertySchema = new mongoose.Schema(
  {

    title: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        "residential",
        "commercial",
        "farmHouse",
        "agriculturalLand",
        "flat",
        "duplex",
        "coreHouse",
        "commercialBuildings",
        "projects",
        "leasePlots",
        "wareHouse",
      ],
     
    },
    desc: {
      type: String,
     
    },
    status: { 
      type: Boolean,
       default: false,
       }, 

       sold:{
       type:Boolean,
       default:false,
       },
       hold:{
        type:Boolean,
        default:false,
       },
    imgUrls: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
     
    },
    
    sqrmeter: {
      type: Number,
      
    },
    sqrfeet: {
      type: Number,
     
    },
    decimil: {
      type: Number,
      
    },
    state: {
      type: String,
      required: true,
    },
    
    statusChangedAt: {
      type: Date,
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
    featured: {
      type: Boolean,
      default: false,
    },
    bathrooms: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    furnished:{
      type:Boolean,
    },
    parking:{
      type:Boolean,
    },
    userRef: {
      type: String,
    },
    additionalFields: [
      {
        type: {
          type: String,
          required: true,
        },
        category: {
          type: String,
        },
        size: {
          type: String,
          required: true,
        },
        units: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        superbuiltup: {
          type: String,
        },
        builtup: {
          type: String,
        },
        carpetarea: {
          type: String,
        },
        status: {
          type: String,
          enum: ["Available", "Booked", "SoldOut"],
          default: "Available",
        },
        subtypes: [
          {
            type: {
              type: String,
              required: true,
            },
            category: {
              type: String,
            },
            size: {
              type: String,
              required: true,
            },
            units: {
              type: String,
              required: true,
            },
            price: {
              type: String,
              required: true,
            },
            superbuiltup: {
              type: String,
            },
            builtup: {
              type: String,
            },
            carpetarea: {
              type: String,
            },
            status: {
              type: String,
              enum: ["Available", "Booked", "SoldOut"],
              default: "Available",
            },
          },
        ],
      },
    ],
    
    // propertyType: {
    //   type: String,
    //   required: true,
    // },
    minBookingAmount: {
      type: String,
     
    },
    features: {
      type: String,
    },
    propertyName: {
      type: String,
    },
  },
  { timestamps: true }
);
const Property = mongoose.model("Property", propertySchema);

export default Property;
   