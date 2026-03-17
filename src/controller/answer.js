import { v4 as uuid } from "uuid";
import AnswerModel from "../models/answer.js";
import QuestionModel from "../models/question.js";

export const getAllAnswersByQuestionId = async (req, res) => {
  try {
    const questionId = req.params.id;
    const answers = await AnswerModel.find({ question_id: questionId });
    res.json(answers);
  } catch {
    res.status(500).json({ message: "Error fetching answers" });
  }
};

export const createAnswer = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { answer_text } = req.body || {};
    const userId = req.user.userId;

    // Check if the question exists
    const question = await QuestionModel.findOne({ id: questionId });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Validate answer text
    if (!answer_text || !answer_text.trim()) {
      return res.status(400).json({
        message: "Answer text is required",
      });
    }

    // Create a new answer
    const newAnswer = new AnswerModel({
      id: uuid(),
      answer_text: answer_text.trim(),
      question_id: questionId,
      userId,
    });

    await newAnswer.save();

    return res
      .status(201)
      .json({ message: "Answer created successfully", answer: newAnswer });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating answer",
      error: error.message,
    });
  }
};

export const deleteAnswerById = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user.userId;

    // Find the answer
    const answer = await AnswerModel.findOne({ id: answerId });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Check if the user is the owner of the answer
    if (answer.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this answer" });
    }

    await AnswerModel.deleteOne({ id: answerId });
    res.json({ message: "Answer deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting answer" });
  }
};

export const likeAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user.userId;

    const answer = await AnswerModel.findOne({ id: answerId });

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    answer.dislikes = answer.dislikes.filter((id) => id !== userId);

    if (!answer.likes.includes(userId)) {
      answer.likes.push(userId);
    }

    await answer.save();

    res.json({
      message: "Answer liked",
      likes: answer.likes.length,
    });
  } catch {
    res.status(500).json({
      message: "Error liking answer",
    });
  }
};

export const dislikeAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user.userId;

    const answer = await AnswerModel.findOne({ id: answerId });

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    answer.likes = answer.likes.filter((id) => id !== userId);

    if (!answer.dislikes.includes(userId)) {
      answer.dislikes.push(userId);
    }

    await answer.save();

    res.json({
      message: "Answer disliked",
      dislikes: answer.dislikes.length,
    });
  } catch {
    res.status(500).json({
      message: "Error disliking answer",
    });
  }
};
