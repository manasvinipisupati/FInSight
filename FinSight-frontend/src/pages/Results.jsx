import { useNavigate } from "react-router-dom";

function Results({ result }) {
  const navigate = useNavigate();

  if (!result) return <p>No results yet</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Financial Risk Assessment</h2>

      <h1 style={{ fontSize: "48px" }}>{result.risk_score}</h1>
      <p><b>Risk Level:</b> {result.risk_level}</p>

      <p>
        <b>Estimated time to financial stress:</b>{" "}
        {result.time_to_stress_months !== null
  ? `${result.time_to_stress_months} months`
  : "No immediate stress"}

      </p>

      <h3>AI Explainability</h3>
      <p style={{ whiteSpace: "pre-line" }}>
  {result.ai_explanation || "Generating AI explanation..."}
</p>


      <button onClick={() => navigate("/explain")}>
        View Risk Breakdown
      </button>
    </div>
  );
}

export default Results;
