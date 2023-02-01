import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Home, Login } from "./components/index";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
