import mongoose from "mongoose";

const schema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", schema);
