import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LeaveMessagePage from "./pages/LeaveMessagePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mensagem" element={<LeaveMessagePage />} />
      
      </Routes>
    </Router>
  );
}

export default App;
