



// import express from "express";
// import {
//   askQuestion,
//   getAllQuestions,
//   getQuestionById,
//   answerQuestion,
//   upvoteQuestion,  // ✅ Import upvote function
//   downvoteQuestion,  // ✅ Import downvote function
//   voteQuestion
// } from "../controllers/questionController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/ask", protect, askQuestion);
// router.get("/", getAllQuestions);
// router.get("/:id", getQuestionById);
// router.post("/:id/answer", protect, answerQuestion);

// // ✅ Add Upvote and Downvote Routes
// router.post("/:id/upvote", protect, upvoteQuestion);
// router.post("/:id/downvote", protect, downvoteQuestion);
// router.post("/:id/vote", protect, voteQuestion); // Upvote/Downvote question


// export default router;



import express from "express";
import {
  askQuestion,
  getAllQuestions,
  getQuestionById,
  answerQuestion,
  voteQuestion // ✅ Single function for both upvote & downvote
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/:id/answer", protect, answerQuestion);

// ✅ Use single route for upvote/downvote
router.post("/:id/vote", protect, voteQuestion); 

export default router;
