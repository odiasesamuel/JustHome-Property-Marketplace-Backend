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

  state: {
    type: String,
    required: true,
  },

  LGA: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  area: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  numberOfRooms: {
    type: Number,
    required: true,
  },

  propertyType: {
    type: String,
    enum: ["Duplex", "Flat"],
    required: true,
  },

  forSaleOrRent: {
    type: String,
    enum: ["Rent", "Sale"],
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  propertyOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  imageUrls: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("Property", propertySchema);
