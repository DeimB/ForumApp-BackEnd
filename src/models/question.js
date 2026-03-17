import mongoose from "mongoose";

const schema = mongoose.Schema({
  id: { type: String, required: true },
  question_text: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  userId: { type: String, required: true },
});

export default mongoose.model("Question", schema);
