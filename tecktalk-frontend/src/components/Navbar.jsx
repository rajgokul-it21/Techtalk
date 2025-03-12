import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react"; // ✅ Import user icon from Lucide

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUsername(data.name); // Assuming the response contains { name: "User Name" }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token from localStorage
    navigate("/login"); // ✅ Redirect to login
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">TeckTalk</Link>
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/ask" className="mr-4">Ask Question</Link>
            
            {/* User Section with Icon */}
            {username && (
              <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                <UserCircle size={20} /> {/* ✅ User Icon */}
                <span className="font-semibold">{username}</span>
              </div>
            )}
            
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
