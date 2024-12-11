import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  accountType: {
    type: String,
    enum: ["Individual", "Property owner", "Property agent"],
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Users", userSchema);
