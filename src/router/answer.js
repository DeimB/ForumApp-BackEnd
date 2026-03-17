import express from "express";
import {
  getAllAnswersByQuestionId,
  createAnswer,
  deleteAnswerById,
  likeAnswer,
  dislikeAnswer,
} from "../controller/answer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/questions/:id/answers", getAllAnswersByQuestionId);

router.post("/questions/:id/answers", auth, createAnswer);

router.delete("/answers/:id", auth, deleteAnswerById);

router.post("/answers/:id/like", auth, likeAnswer);

router.post("/answers/:id/dislike", auth, dislikeAnswer);

export default router;
