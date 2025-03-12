

// import mongoose from "mongoose";

// const answerSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     content: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const questionSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     tags: [{ type: String }], // Optional: To categorize questions
//     answers: [answerSchema], // Array of answers
//   },
//   { timestamps: true }
// );

// // ✅ Automatically populate user details for questions and answers
// questionSchema.pre("find", function (next) {
//   this.populate("user", "name email") // Populate question author
//       .populate("answers.user", "name email"); // Populate answer authors
//   next();
// });

// questionSchema.pre("findOne", function (next) {
//   this.populate("user", "name email") // Populate question author
//       .populate("answers.user", "name email"); // Populate answer authors
//   next();
// });

// const Question = mongoose.model("Question", questionSchema);
// export default Question;



import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
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
    answers: [answerSchema],
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["upvote", "downvote"] }, // Only "upvote" or "downvote"
      },
    ],
  },
  { timestamps: true }
);


// ✅ Automatically populate user details for questions and answers
questionSchema.pre("find", function (next) {
  this.populate("user", "name email")
      .populate("answers.user", "name email");
  next();
});

questionSchema.pre("findOne", function (next) {
  this.populate("user", "name email")
      .populate("answers.user", "name email");
  next();
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
