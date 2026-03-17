import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: { type: String, required: true },
  answer_text: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  question_id: { type: String, required: true },
  userId: { type: String, required: true },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
});

// Index to quickly find answers by question
schema.index({ question_id: 1 });

// Index for sorting by date
schema.index({ date: -1 });

export default mongoose.model("Answer", schema);
