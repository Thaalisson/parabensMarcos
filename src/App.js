import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LeaveMessagePage from "./pages/LeaveMessagePage";
import Celebration from "./components/Celebration"; // Importa direto

function App() {
  return (
    <Router>

          {/* 🔥 Dummy Hidden Form para o Netlify detectar no build */}
       <form name="marcos-messages" data-netlify="true" hidden>
        <input type="text" name="name" />
        <textarea name="message"></textarea>
        <input type="file" name="photo" />
      </form>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mensagem" element={<LeaveMessagePage />} />
        <Route path="/celebration" element={<Celebration />} /> 
      </Routes>
    </Router>
  );
}

export default App;
