// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const QuestionDetail = () => {
//   const { id: questionId } = useParams(); // Extract questionId from URL
//   const [question, setQuestion] = useState(null);
//   const [newAnswer, setNewAnswer] = useState("");

//   // Fetch question details
//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/questions/${questionId}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch question");
//         }
//         const data = await response.json();
//         setQuestion(data);
//       } catch (error) {
//         console.error("Error fetching question:", error.message);
//       }
//     };

//     if (questionId) fetchQuestion();
//   }, [questionId]);

//   // Handle answer submission
//   const handleSubmitAnswer = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     const token = localStorage.getItem("token"); // Retrieve the token
//     if (!token) {
//       console.error("No token found, please login.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/questions/${questionId}/answer`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Send token in the headers
//         },
//         body: JSON.stringify({ content: newAnswer }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to post answer");
//       }

//       const updatedQuestion = await response.json();
//       setQuestion(updatedQuestion); // Update question with the new answer
//       setNewAnswer(""); // Clear input field
//     } catch (error) {
//       console.error("Error posting answer:", error.message);
//     }
//   };

//   if (!question) return <p>Loading...</p>; // Show loading state

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
//       <p className="text-gray-700">{question.description}</p>
//       <div className="mt-4 text-sm text-gray-500">Tags: {question.tags.join(", ")}</div>

//       {/* Answers Section */}
//       <h3 className="text-xl font-semibold mt-6">Answers</h3>
//       <ul className="mt-2">
//         {question.answers && question.answers.length > 0 ? (
//           question.answers.map((answer) => (
//             <li key={answer._id} className="border-b py-2">
//               <p className="text-gray-800">{answer.content}</p>
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-500">No answers yet. Be the first to answer!</p>
//         )}
//       </ul>

//       {/* Answer Input Form */}
//       <form onSubmit={handleSubmitAnswer} className="mt-4">
//         <textarea
//           className="w-full p-2 border border-gray-300 rounded"
//           rows="3"
//           placeholder="Write your answer here..."
//           value={newAnswer}
//           onChange={(e) => setNewAnswer(e.target.value)}
//           required
//         ></textarea>
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
//         >
//           Submit Answer
//         </button>
//       </form>
//     </div>
//   );
// };

// export default QuestionDetail;



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");

  // Fetch question details
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
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

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newAnswer }),
      });

      if (!response.ok) {
        throw new Error("Failed to post answer");
      }

      setNewAnswer("");
      fetchQuestion(); // Refresh the question data to show the new answer
    } catch (error) {
      console.error("Error posting answer:", error.message);
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
      <p className="text-gray-700">{question.description}</p>

      {/* Answers Section */}
      <h3 className="text-xl font-semibold mt-6">Answers</h3>
      <ul className="mt-2">
        {question.answers && question.answers.length > 0 ? (
          question.answers.map((answer) => (
            <li key={answer._id} className="border-b py-2">
              <p className="text-gray-800">{answer.content}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No answers yet. Be the first to answer!</p>
        )}
      </ul>

      {/* Answer Input Form */}
      <form onSubmit={handleSubmitAnswer} className="mt-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows="3"
          placeholder="Write your answer here..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
};

export default QuestionDetail;
