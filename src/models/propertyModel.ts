import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  propertyDetails: {
    type: {
      city: String,
      area: String,
      numberOfRooms: Number,
    },
    required: true,
  },
});

export default mongoose.model("Property", propertySchema);
