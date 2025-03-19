import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const answerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["upvote", "downvote"] },
      },
    ],
    replies: [replySchema], // ✅ Added replies field
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    answers: [answerSchema], // Embedded answers
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["upvote", "downvote"] },
      },
    ],
  },
  { timestamps: true }
);

questionSchema.pre("find", function (next) {
  this.populate("user", "name email").populate("answers.user", "name email");
  next();
});

questionSchema.pre("findOne", function (next) {
  this.populate("user", "name email").populate("answers.user", "name email");
  next();
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
