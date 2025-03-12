import Question from "../models/Question.js";

// ✅ Upvote a question
export const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.upvotes += 1;
    await question.save();

    res.json({ message: "Question upvoted successfully", upvotes: question.upvotes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Downvote a question
export const downvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.downvotes += 1;
    await question.save();

    res.json({ message: "Question downvoted successfully", downvotes: question.downvotes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


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



// @desc   Ask a new question
// @route  POST /api/questions/ask
// @access Private
export const askQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  try {
    const question = new Question({
      user: req.user._id,
      title,
      description,
      tags,
    });

    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all questions
// @route  GET /api/questions
// @access Public
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "name email") // Get question owner's name & email
      .populate("answers.user", "name email"); // Get answer authors' name & email
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc   Get a single question with answers
// @route  GET /api/questions/:id
// @access Public

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
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc   Answer a question
// @route  POST /api/questions/:id/answer
// @access Private
export const answerQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newAnswer = {
      content: req.body.content,
      user: req.user.id, // Make sure req.user is set in protect middleware
    };
    console.log("User making the request:", req.user);

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(question); // Return updated question with answers
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


