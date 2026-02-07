import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import TV from "./pages/TV";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TV />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
