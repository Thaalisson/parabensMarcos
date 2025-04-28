import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LeaveMessagePage from "./pages/LeaveMessagePage";
import Celebration from "./components/Celebration"; // Importa direto

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mensagem" element={<LeaveMessagePage />} />
        <Route path="/celebration" element={<Celebration />} /> 
      </Routes>
    </Router>
  );
}

export default App;
