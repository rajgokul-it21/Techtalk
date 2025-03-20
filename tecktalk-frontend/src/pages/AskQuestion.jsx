// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AskQuestion = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token"); // ✅ Get Token from localStorage
//     if (!token) {
//       alert("Please login to ask a question.");
//       navigate("/login");
//       return;
//     }

//     const questionData = {
//       title,
//       description,
//       tags: tags.split(",").map((tag) => tag.trim()), // Convert tags to array
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/questions/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // ✅ Send Token in Headers
//         },
//         body: JSON.stringify(questionData),
//       });

//       const data = await response.json();
//       console.log("Post Question Response:", data); // ✅ Debugging

//       if (response.ok) {
//         alert("Question posted successfully!");
//         navigate("/");
//       } else {
//         alert(data.message || "Failed to post question.");
//       }
//     } catch (error) {
//       console.error("Error posting question:", error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
//       <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Input Fields */}
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Post Question
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AskQuestion;



import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // ✅ Get Token from localStorage
    if (!token) {
      alert("Please login to ask a question.");
      navigate("/login");
      return;
    }

    const questionData = {
      title,
      description,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert tags to array
    };

    try {
      const response = await fetch(`${process.env.base_url}/api/questions/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send Token in Headers
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();
      console.log("Post Question Response:", data); // ✅ Debugging

      if (response.ok) {
        alert("Question posted successfully!");
        navigate("/");
      } else {
        alert(data.message || "Failed to post question.");
      }
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tags (comma-separated):</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;
