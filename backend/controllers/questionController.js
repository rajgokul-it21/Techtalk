import Question from "../models/Question.js";

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
    const questions = await Question.find().populate("user", "name email");
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single question with answers
// @route  GET /api/questions/:id
// @access Public
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("user", "name email");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
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


