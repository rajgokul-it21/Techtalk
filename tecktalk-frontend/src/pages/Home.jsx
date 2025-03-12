import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react"; // Import icons

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleVote = async (questionId, voteType) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${questionId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user is authenticated
          },
          body: JSON.stringify({ voteType }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId
              ? { ...q, upvotes: data.upvotes, downvotes: data.downvotes }
              : q
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex">
      {/* Sidebar for Tags */}
      <aside className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3">Filter by Tag</h3>
        <select
          className="p-2 border border-gray-300 rounded w-full"
          onChange={(e) => setSelectedTag(e.target.value)}
          value={selectedTag}
        >
          <option value="">All</option>
          {[...new Set(questions.flatMap((q) => q.tags))].map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </aside>

      {/* Main Content */}
      <div className="w-3/4 ml-6">
        <h1 className="text-3xl font-bold mb-4">Latest Questions</h1>
        {questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          <ul className="space-y-4">
            {questions
              .filter((q) => (selectedTag ? q.tags.includes(selectedTag) : true))
              .map((q) => (
                <li
                  key={q._id}
                  className="p-4 bg-gray-900 text-white shadow-md rounded-lg border border-gray-700"
                >
                  {/* Question Title */}
                  <Link
                    to={`/question/${q._id}`}
                    className="text-blue-400 text-xl font-semibold hover:underline"
                  >
                    {q.title}
                  </Link>
                  <p className="text-gray-400 mt-2">{q.description}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    <strong>Asked by:</strong> {q.user?.name || "Unknown"}
                  </p>

                  {/* Tags */}
                  <div className="mt-2">
                    {q.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-2 py-1 text-sm rounded mr-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Upvote, Downvote & Comments */}
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mt-3">
                    {/* Upvote */}
                    <button
                      onClick={() => handleVote(q._id, "upvote")}
                      className={`flex items-center space-x-1 ${
                        q.userVote === "upvote" ? "text-blue-500" : ""
                      } hover:text-blue-500`}
                    >
                      <ArrowUp className="w-5 h-5" />
                      <span className="font-medium">Upvote</span>
                      <span className="text-gray-300">· {q.upvotes || 0}</span>
                    </button>

                    {/* Downvote */}
                    <button
                      onClick={() => handleVote(q._id, "downvote")}
                      className="flex items-center hover:text-gray-500"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>

                    {/* Comments (Number of Answers) */}
                    <Link
                      to={`/question/${q._id}`}
                      className="flex items-center space-x-1 hover:text-gray-300"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{q.answers?.length || 0}</span>
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
