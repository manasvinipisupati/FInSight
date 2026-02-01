import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const NAVY = "#00022E";
  const OFF_WHITE = "#F9FAFB";

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden", // ✅ prevents unnecessary scroll
        backgroundColor: NAVY,
        color: OFF_WHITE,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "48px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* 🔗 EXTERNAL TOOL LINK */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 24px",
          textAlign: "right",
        }}
      >
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "20px",
            color: "orange",
            textDecoration: "underline",
          }}
        >
          Go to Smart Compliance Copilot →
        </a>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "44px",
            fontWeight: "700",
            marginBottom: "8px",
            letterSpacing: "-0.5px",
          }}
        >
          FinSight
        </h1>

        <p
          style={{
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "16px",
            opacity: 0.9,
          }}
        >
          Insight into hidden financial stress
        </p>

        <p
          style={{
            maxWidth: "680px",
            margin: "0 auto 40px",
            fontSize: "16px",
            lineHeight: "1.6",
            opacity: 0.85,
          }}
        >
          AI-powered financial risk intelligence for individuals and businesses.
          Identify vulnerabilities early and make informed decisions.
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
        }}
      >
        {/* INDIVIDUAL */}
        <div
          style={{
            backgroundColor: OFF_WHITE,
            color: NAVY,
            borderRadius: "12px",
            padding: "32px",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>👤</div>

          <h2 style={{ marginBottom: "8px" }}>Individual</h2>

          <p
            style={{
              lineHeight: "1.6",
              marginBottom: "24px",
              fontSize: "15px",
            }}
          >
            Personal financial risk assessment to understand your financial
            health and plan ahead with confidence.
          </p>

          <button
            onClick={() => navigate("/upload/individual")}
            style={{
              backgroundColor: NAVY,
              color: OFF_WHITE,
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get Started →
          </button>
        </div>

        {/* SME */}
        <div
          style={{
            backgroundColor: OFF_WHITE,
            color: NAVY,
            borderRadius: "12px",
            padding: "32px",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>🏢</div>

          <h2 style={{ marginBottom: "8px" }}>SME</h2>

          <p
            style={{
              lineHeight: "1.6",
              marginBottom: "24px",
              fontSize: "15px",
            }}
          >
            Financial risk analysis for small and medium enterprises to ensure
            stability, growth, and resilience.
          </p>

          <button
            onClick={() => navigate("/upload/sme")}
            style={{
              backgroundColor: NAVY,
              color: OFF_WHITE,
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
