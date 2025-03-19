import express from "express";
import {
  askQuestion,
  getAllQuestions,
  getQuestionById,
  answerQuestion,
  voteQuestion,
  voteAnswer,
  replyToAnswer // ✅ Added new function
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/:id/answer", protect, answerQuestion);
router.post("/:id/vote", protect, voteQuestion); 
router.post("/:id/answer/vote", protect, voteAnswer); // ✅ New endpoint
router.post("/:id/answer/reply", protect, replyToAnswer);


export default router;
