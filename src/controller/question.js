import QuestionModel from "../models/question.js";
import { v4 as uuid } from "uuid";
import UserModel from "../models/user.js";

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await QuestionModel.find().sort({ date: -1 });
    return res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.userId) {
      return res.status(401).json({ message: "Bad auth" });
    }

    const user = await UserModel.findOne({ id: data.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!data.question_text) {
      return res.status(400).json({ message: "Question text is required" });
    }

    const question = await QuestionModel.create({
      id: uuid(),
      question_text: String(data.question_text).trim(),
      date: new Date(),
      userId: data.userId,
    });

    return res.status(201).json({
      message: "Question successfully created",
      question,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating question", error: err.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await QuestionModel.findOne({ id });

    if (!question) {
      return res.status(404).json({ message: `No question with id: ${id}` });
    }

    return res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error });
  }
};

export const deleteQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body || {};

    const user = await UserModel.findOne({ id: data.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const question = await QuestionModel.findOne({ id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.userId !== data.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this question" });
    }

    await QuestionModel.deleteOne({ id });

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};
