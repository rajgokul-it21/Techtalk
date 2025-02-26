import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected Routes */}
        <Route path="/ask" element={<PrivateRoute><AskQuestion /></PrivateRoute>} />
        <Route path="/question/:id" element={<PrivateRoute><QuestionDetail /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
