import QuestionModel from "../models/question.js";
import AnswerModel from "../models/answer.js";
import { v4 as uuid } from "uuid";

// export const getAllQuestions = async (req, res) => {
//   try {
//     const questions = await QuestionModel.find().sort({ date: -1 });
//     return res.status(200).json({ questions });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching questions", error });
//   }
// };

export const getAllQuestions = async (req, res) => {
  try {
    // Read query parameter from URL
    // Example: /questions?filter=answered
    const { filter } = req.query;

    // Aggregation pipeline = a sequence of operations performed by MongoDB
    const pipeline = [
      {
        // Join questions collection with answers collection
        // Similar to SQL JOIN
        $lookup: {
          from: "answers", // MongoDB collection name
          localField: "id", // field from QuestionModel
          foreignField: "question_id", // field from AnswerModel
          as: "answers", // name of resulting array field
        },
      },
      {
        // Add a new field called answersCount
        // It stores the number of answers for each question
        $addFields: {
          answersCount: { $size: "$answers" },
        },
      },
    ];

    // If user requested answered questions
    if (filter === "answered") {
      pipeline.push({
        // Only keep questions that have at least 1 answer
        $match: { answersCount: { $gt: 0 } },
      });
    }

    // If user requested unanswered questions
    if (filter === "unanswered") {
      pipeline.push({
        // Only keep questions that have 0 answers
        $match: { answersCount: 0 },
      });
    }

    // Remove the answers array from the final result
    // because we only need the count
    pipeline.push({
      $project: {
        answers: 0,
      },
    });

    // Sort questions by date (newest first)
    pipeline.push({
      $sort: { date: -1 },
    });

    // Execute aggregation pipeline in MongoDB
    const questions = await QuestionModel.aggregate(pipeline);

    // Send response to client
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { question_text } = req.body;
    const userId = req.user.userId;

    if (!question_text) {
      return res.status(400).json({
        message: "Question text is required",
      });
    }

    const question = new QuestionModel({
      id: uuid(),
      question_text: question_text.trim(),
      userId,
    });

    await question.save();

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
    const questionId = req.params.id;
    const userId = req.user.userId;

    const question = await QuestionModel.findOne({ id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this question" });
    }

    await QuestionModel.deleteOne({ id: questionId });

    await AnswerModel.deleteMany({ question_id: questionId });

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};
