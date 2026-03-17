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

export default mongoose.model("Answer", schema);
