import Question from "../models/Question.js";

// ✅ Upvote or Downvote a Question


// ✅ Improved Vote Handling
export const voteQuestion = async (req, res) => {
  try {
    const { voteType } = req.body; // "upvote" or "downvote"
    const userId = req.user._id; // Get user ID from auth middleware

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find existing vote from the user
    const existingVoteIndex = question.votes.findIndex(
      (vote) => vote.user.toString() === userId.toString()
    );

    if (existingVoteIndex !== -1) {
      const existingVote = question.votes[existingVoteIndex];

      // If the user is trying to toggle the same vote, remove it
      if (existingVote.type === voteType) {
        question.votes.splice(existingVoteIndex, 1);
      } else {
        // Otherwise, change the vote type
        question.votes[existingVoteIndex].type = voteType;
      }
    } else {
      // If no vote exists, add a new one
      question.votes.push({ user: userId, type: voteType });
    }

    await question.save();

    // Calculate upvotes and downvotes count
    const upvotes = question.votes.filter((v) => v.type === "upvote").length;
    const downvotes = question.votes.filter((v) => v.type === "downvote").length;

    res.json({ success: true, upvotes, downvotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Ask a new Question
export const askQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = new Question({
      user: req.user._id,
      title,
      description,
      tags,
    });

    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error in asking question:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "name email") // Get question owner's name & email
      .populate("answers.user", "name email"); // Get answer authors' name & email

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get a Single Question by ID
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("user", "name email") // Get question owner's name & email
      .populate("answers.user", "name email"); // Get answer authors' name & email

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Answer a Question
export const answerQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newAnswer = {
      content: req.body.content,
      user: req.user._id, // Ensure `req.user` is set by protect middleware
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(question);
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
