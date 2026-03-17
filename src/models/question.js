import mongoose from "mongoose";

const schema = mongoose.Schema({
  id: { type: String, required: true },
  question_text: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  userId: { type: String, required: true },
});

// Index for faster searches by question id
schema.index({ id: 1 });

// Index for sorting by date
schema.index({ date: -1 });

export default mongoose.model("Question", schema);
