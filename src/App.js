import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeaveMessagePage from "./pages/LeaveMessagePage";
import Celebration from "./components/Celebration";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Celebration/>} />
        <Route path="/mensagem" element={<LeaveMessagePage />} />
        <Route path="/Celebration"  element={<Celebration />}/>
      </Routes>
    </Router>
  );
}

export default App;
