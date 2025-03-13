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
    unique: true,
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

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isResetPasswordRequestVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
  },
});

export default mongoose.model("Users", userSchema);
