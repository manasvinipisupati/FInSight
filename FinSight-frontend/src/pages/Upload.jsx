import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

function Upload({ setResult }) {
  const { type } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const NAVY = "#00022E";
  const OFF_WHITE = "#F9FAFB";

  const submitFile = async () => {
    if (!file) {
      alert("Please upload a CSV file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/analyze/${type}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Invalid CSV for selected user type");
        return;
      }

      const data = await response.json();
      setResult(data);
      navigate("/results");
    } catch (err) {
      alert("Server not reachable. Is backend running?");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden", // ✅ remove unnecessary scroll
        backgroundColor: NAVY,
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: OFF_WHITE,
        boxSizing: "border-box",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          padding: "16px 24px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: OFF_WHITE,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "8px",
            fontWeight: "700",
          }}
        >
          Upload Financial Data
        </h1>

        <p
          style={{
            opacity: 0.85,
            marginBottom: "40px",
          }}
        >
          {type === "sme"
            ? "SME business risk analysis"
            : "Individual financial risk analysis"}
        </p>

        {/* UPLOAD CARD */}
        <div
          style={{
            backgroundColor: OFF_WHITE,
            color: NAVY,
            borderRadius: "16px",
            padding: "40px",
          }}
        >
          <label
            style={{
              display: "block",
              border: `2px dashed ${NAVY}`,
              borderRadius: "14px",
              padding: "48px 20px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⬆️</div>

            <p style={{ fontWeight: "600", marginBottom: "4px" }}>
              {file ? file.name : "Drop your CSV file here"}
            </p>

            <p style={{ fontSize: "14px", opacity: 0.7 }}>
              or click to browse
            </p>

            <p
              style={{
                marginTop: "12px",
                fontSize: "13px",
                opacity: 0.6,
              }}
            >
              Supported format: .csv
            </p>

            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* ANALYZE BUTTON */}
        <button
          onClick={submitFile}
          disabled={!file}
          style={{
            marginTop: "32px",
            backgroundColor: file ? OFF_WHITE : "#d1d5db",
            color: NAVY,
            border: "none",
            borderRadius: "10px",
            padding: "14px 28px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: file ? "pointer" : "not-allowed",
          }}
        >
          Analyze Financial Data
        </button>

        {!file && (
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              opacity: 0.7,
            }}
          >
            Please upload a CSV file to continue
          </p>
        )}
      </div>
    </div>
  );
}

export default Upload;
