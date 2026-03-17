import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  deleteQuestionById,
} from "../controller/question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/questions", getAllQuestions);

router.get("/questions/:id", getQuestionById);

router.post("/questions", auth, createQuestion);

router.delete("/questions/:id", auth, deleteQuestionById);

export default router;
