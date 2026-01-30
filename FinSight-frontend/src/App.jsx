import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home.jsx";
import Upload from "./pages/Upload.jsx";
import Results from "./pages/Results.jsx";
import Explain from "./pages/Explain.jsx";

function App() {
  const [result, setResult] = useState(() => {
    const saved = localStorage.getItem("finsight_result");
    return saved ? JSON.parse(saved) : null;
  });

  const updateResult = (data) => {
    setResult(data);
    localStorage.setItem("finsight_result", JSON.stringify(data));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/upload/:type"
          element={<Upload setResult={updateResult} />}
        />
        <Route path="/results" element={<Results result={result} />} />
        <Route path="/explain" element={<Explain result={result} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
