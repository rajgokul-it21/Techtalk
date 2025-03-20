import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Search } from "lucide-react";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [tagSearch, setTagSearch] = useState(""); // Search input state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Control dropdown visibility

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.base_url}/api/questions`);
        const data = await response.json();

        const updatedQuestions = data.map((q) => ({
          ...q,
          upvotes: q.votes.filter((v) => v.type === "upvote").length,
          downvotes: q.votes.filter((v) => v.type === "downvote").length,
        }));

        setQuestions(updatedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleVote = async (questionId, voteType) => {
    try {
      const response = await fetch(
        `${process.env.base_url}/api/questions/${questionId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ voteType }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId
              ? {
                  ...q,
                  upvotes: data.upvotes,
                  downvotes: data.downvotes,
                  userVote: q.userVote === voteType ? null : voteType, // Toggle vote
                }
              : q
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Extract unique tags from questions
  const allTags = [...new Set(questions.flatMap((q) => q.tags))];

  // Filter tags based on search input
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="max-w-8xl mx-auto p-3 pt-6 flex h-screen overflow-hidden"  >
      {/* Left Sidebar (Fixed) */}
      <aside className="w-1/4 p-4 bg-gray-800 text-white rounded-lg shadow-md h-screen sticky top-16 border border-gray-700">
  <h3 className="text-lg font-bold mb-3">Filter by Tag</h3>

  {/* Dropdown with Search */}
  <div className="relative">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="p-2 border border-gray-600 rounded w-full text-left bg-gray-700 text-white"
    >
      {selectedTag ? `#${selectedTag}` : "Select a Tag"}
    </button>

    {dropdownOpen && (
      <div className="absolute mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
        {/* Search Input Inside Dropdown with Icon */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="p-2 pl-10 border-b border-gray-700 w-full bg-gray-800 text-white"
          />
        </div>

        {/* Tags List */}
        <div className="max-h-40 overflow-y-auto">
          <div
            onClick={() => {
              setSelectedTag("");
              setDropdownOpen(false);
            }}
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            All
          </div>
          {filteredTags.length > 0 ? (
            filteredTags.map((tag, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedTag(tag);
                  setDropdownOpen(false);
                }}
                className={`p-2 cursor-pointer ${
                  selectedTag === tag ? "bg-blue-500 text-white" : "hover:bg-gray-700"
                }`}
              >
                #{tag}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-400">No tags found</div>
          )}
        </div>
      </div>
    )}
  </div>
</aside>


      {/* Questions List (Scrollable) */}
      <div className="w-3/4 ml-6 min-h-screen overflow-y-auto pb-20">
        <h1 className="text-3xl text-white font-bold mb-4">Latest Questions</h1>
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
                {/* Display username first, followed by the question */}
                <h2 className="text-gray-500 text-sm">
                  <span className=" text-xl text-blue-400 font-bold">{q.user?.name || "Unknown"}</span> :
                  <Link
            to={`/question/${q._id}`}
            className="text-xl font-semibold text-white hover:underline"
          >
            {" "}{q.title}
          </Link>
                </h2>
                <p className="text-gray-400 mt-2">{q.description}</p>

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

                  {/* Vote UI */}
                  <div className="flex items-center gap-3 mt-3 border border-gray-600 rounded-full px-3 py-1">
                    {/* Upvote Button */}
                    <button
                      onClick={() => handleVote(q._id, "upvote")}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        q.userVote === "upvote"
                          ? "text-blue-500 border border-blue-500 bg-blue-900/20"
                          : "text-gray-400 hover:text-blue-400"
                      } transition`}
                    >
                      <ArrowBigUp size={20} />
                      <span className="text-sm">Upvote · {q.upvotes || 0}</span>
                    </button>

                    {/* Downvote Button */}
                    <button
                      onClick={() => handleVote(q._id, "downvote")}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        q.userVote === "downvote"
                          ? "text-red-500 border border-red-500 bg-red-900/20"
                          : "text-gray-400 hover:text-red-400"
                      } transition`}
                    >
                      <ArrowBigDown size={20} />
                    </button>

                    {/* Comment Button */}
                    <Link to={`/question/${q._id}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                      <MessageSquare size={18} />
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
