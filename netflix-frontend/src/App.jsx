import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import Signin from "./components/Signin";
import WatchParty from "./components/watchParty.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/watch-party" element={<WatchParty />} />
      </Routes>
    </Router>
  );
}

export default App;