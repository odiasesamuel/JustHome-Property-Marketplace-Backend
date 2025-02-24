import mongoose, { Schema } from "mongoose";

const newsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model("newsletter_email", newsletterSchema);
