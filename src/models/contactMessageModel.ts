import mongoose, { Schema } from "mongoose";

const contactMessageSchema = new Schema({
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

  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model("contact_message", contactMessageSchema);
