import express from "express";
import {
  askQuestion,
  getAllQuestions,
  getQuestionById,
  answerQuestion,
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askQuestion); // Ask a question
router.get("/", getAllQuestions); // Get all questions
router.get("/:id", getQuestionById); // Get a single question
router.post("/:id/answer", protect, answerQuestion); // Answer a question

export default router;
