// src/layout/App.jsx or wherever routing is
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby"; // Add later

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} /> {/* Placeholder for now */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
