import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Authentication/AuthContext";
import ProtectedRoute from "./Authentication/ProtectedRoute";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import Signin from "./components/Signin";
import Home from "./components/Home";
import Watch from "./components/Watch";
import MovieDetails from "./components/MovieDetails";
import Profile from "./components/Profile";
import Account from "./components/Account";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/browse" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;