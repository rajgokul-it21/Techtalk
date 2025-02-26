import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [questions, setQuestions] = useState([]);

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

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Latest Questions</h1>
      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li
              key={q._id}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-300"
            >
              <Link to={`/question/${q._id}`} className="text-blue-500 text-xl font-semibold">
                {q.title}
              </Link>
              <p className="text-gray-600 mt-2">{q.description}</p>
              <div className="mt-2">
                {q.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded mr-2">
                    #{tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
