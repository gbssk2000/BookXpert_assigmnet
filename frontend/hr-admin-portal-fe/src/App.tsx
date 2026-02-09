import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
