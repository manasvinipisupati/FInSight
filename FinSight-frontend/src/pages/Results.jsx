import { useNavigate } from "react-router-dom";

function Results({ result }) {
  const navigate = useNavigate();

  const NAVY = "#00022E";
  const OFF_WHITE = "#F9FAFB";

  if (!result) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No results yet</h2>
      </div>
    );
  }

  const getRiskColor = (level) => {
    if (!level) return "#64748b";
    const l = level.toLowerCase();
    if (l === "low") return "#16a34a";
    if (l === "medium") return "#f59e0b";
    return "#dc2626";
  };

  const riskColor = getRiskColor(result.risk_level);
  const riskScore = Math.min(Math.max(result.risk_score, 0), 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: OFF_WHITE,
        color: NAVY,
        padding: "40px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <h1 style={{ textAlign: "center", marginBottom: "36px" }}>
          Financial Risk Assessment
        </h1>

        {/* TOP GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* RISKOMETER */}
          <div
            style={{
              background: "#ffffff",
              border: `1px solid ${NAVY}`,
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Risk Score</h3>

            <div
              style={{
                fontSize: "72px",
                fontWeight: "700",
                color: riskColor,
                textAlign: "center",
              }}
            >
              {riskScore}
            </div>

            <div
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginBottom: "24px",
                color: riskColor,
              }}
            >
              {result.risk_level?.toUpperCase()} RISK
            </div>

            {/* BAR */}
            <div
              style={{
                height: "14px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${riskScore}%`,
                  height: "100%",
                  background: riskColor,
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginTop: "8px",
                color: "#64748b",
              }}
            >
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* QUICK STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <StatBox
              label="Time to Financial Stress"
              value={
                result.time_to_stress_months !== null
                  ? `${result.time_to_stress_months} months`
                  : "No immediate stress"
              }
            />
            <StatBox
              label="Risk Level"
              value={result.risk_level}
              valueColor={riskColor}
            />
            <StatBox label="Model Confidence" value="High" />
            <StatBox label="Trend" value="Increasing" />
          </div>
        </div>

        {/* AI EXPLAINABILITY */}
        <div
          style={{
            background: "#ffffff",
            border: `1px solid ${NAVY}`,
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>
            AI Explainability Summary
          </h3>

          <div
            style={{
              fontSize: "15px",
              lineHeight: "1.8",
              whiteSpace: "pre-line",
            }}
          >
            {result.ai_explanation || "Generating AI explanation..."}
          </div>
        </div>

        {/* ACTION */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/explain")}
            style={{
              background: NAVY,
              color: OFF_WHITE,
              border: "none",
              borderRadius: "10px",
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View Detailed Risk Breakdown →
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable stat box */
function StatBox({ label, value, valueColor }) {
  const NAVY = "#00022E";

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${NAVY}`,
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: "13px", opacity: 0.7, marginBottom: "6px" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: valueColor || NAVY,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default Results;
