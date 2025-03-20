import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  // Fetch question details
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}`);
      if (!response.ok) throw new Error("Failed to fetch question");
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error.message);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  // Handle answer submission
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${id}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newAnswer }),
        }
      );

      if (!response.ok) throw new Error("Failed to post answer");

      setNewAnswer("");
      fetchQuestion();
    } catch (error) {
      console.error("Error posting answer:", error.message);
    }
  };

  // Handle answer voting
  const handleVoteAnswer = async (answerId, voteType) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${id}/answer/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answerId, voteType }),
        }
      );

      if (!response.ok) throw new Error("Failed to vote on answer");

      fetchQuestion();
    } catch (error) {
      console.error("Error voting on answer:", error.message);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (answerId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (!replyContent[answerId]) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${id}/answer/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answerId, content: replyContent[answerId] }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit reply");

      setReplyContent({ ...replyContent, [answerId]: "" });
      setShowReplyInput({ ...showReplyInput, [answerId]: false });
      fetchQuestion();
    } catch (error) {
      console.error("Error submitting reply:", error.message);
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-md rounded-lg border border-gray-700 max-h-[80vh] overflow-y-auto scroll-smooth">
      <h2 className="text-2xl font-bold mb-2">
        <span className="text-blue-400">{question.user?.name || "Unknown"}</span>: {question.title}
      </h2>
      <p className="text-gray-300">{question.description}</p>

      {/* Answer Input Form */}
      <form onSubmit={handleSubmitAnswer} className="mt-6">
        <textarea
          className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded"
          rows="3"
          placeholder="Write your answer here..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Submit Answer
        </button>
      </form>

      {/* Answers Section */}
      <h3 className="text-xl font-semibold mt-6 border-b border-gray-600 pb-2">
        Answers
      </h3>
      <ul className="mt-4 space-y-4">
        {question.answers && question.answers.length > 0 ? (
          question.answers.map((answer) => (
            <li
              key={answer._id}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <p className="text-gray-300">
                <strong className="text-blue-400">{answer.user?.name || "Unknown"}:</strong> {answer.content}
              </p>

              {/* Vote UI */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-400 hover:text-blue-400"
                  onClick={() => handleVoteAnswer(answer._id, "upvote")}
                >
                  <ArrowBigUp size={20} />
                  <span className="text-sm">
                    {answer.votes?.filter((v) => v.type === "upvote").length || 0}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-400 hover:text-red-400"
                  onClick={() => handleVoteAnswer(answer._id, "downvote")}
                >
                  <ArrowBigDown size={20} />
                  <span className="text-sm">
                    {answer.votes?.filter((v) => v.type === "downvote").length || 0}
                  </span>
                </button>
              </div>

              {/* Reply Section */}
              <div className="mt-4 max-h-40 overflow-y-auto border border-gray-700 p-3 rounded-lg scroll-smooth">
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() =>
                    setShowReplyInput((prev) => ({
                      ...prev,
                      [answer._id]: !prev[answer._id],
                    }))
                  }
                >
                  Reply
                </button>
                {showReplyInput[answer._id] && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Reply to this answer..."
                      className="border border-gray-600 p-2 rounded w-full bg-gray-700 text-white"
                      value={replyContent[answer._id] || ""}
                      onChange={(e) =>
                        setReplyContent({
                          ...replyContent,
                          [answer._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleReplySubmit(answer._id)}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>

              {/* Display Replies */}
              {answer.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-4 border-gray-500">
                  <h4 className="font-semibold">Replies:</h4>
                  {answer.replies.map((reply) => (
                    <div key={reply._id} className="text-gray-400 mt-2">
                      <b className="text-blue-400">{reply.user?.name || "Unknown"}</b>: {reply.content}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No answers yet. Be the first to answer!</p>
        )}
      </ul>
    </div>
  );
};

export default QuestionDetail;
