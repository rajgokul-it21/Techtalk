

// import express from "express";
// import {
//   askQuestion,
//   getAllQuestions,
//   getQuestionById,
//   answerQuestion,
// } from "../controllers/questionController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/ask", protect, askQuestion); // Ask a question
// router.get("/", getAllQuestions); // Get all questions (with user details)
// router.get("/:id", getQuestionById); // Get a single question (with user details and answers)
// router.post("/:id/answer", protect, answerQuestion); // Answer a question

// export default router;


import express from "express";
import {
  askQuestion,
  getAllQuestions,
  getQuestionById,
  answerQuestion,
  upvoteQuestion,  // ✅ Import upvote function
  downvoteQuestion,  // ✅ Import downvote function
  voteQuestion
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/:id/answer", protect, answerQuestion);

// ✅ Add Upvote and Downvote Routes
router.post("/:id/upvote", protect, upvoteQuestion);
router.post("/:id/downvote", protect, downvoteQuestion);
router.post("/:id/vote", protect, voteQuestion); // Upvote/Downvote question


export default router;
