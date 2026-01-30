import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

function Upload({ setResult }) {
  const { type } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const submitFile = async () => {
  if (!file) {
    alert("Please upload a CSV file");
    return;
  }

  try {
    console.log("Submitting file...");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/analyze/${type}`, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
  const err = await response.json();
  alert(err.error || "Invalid CSV for selected user type");
  return;
}


    const data = await response.json();
    console.log("Result received:", data);

    setResult(data);
    navigate("/results");

  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Server not reachable. Is backend running?");
  }
};


  return (
    <div>
      <h2>Upload CSV ({type})</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={submitFile}>
        Analyze
      </button>
    </div>
  );
}

export default Upload;
