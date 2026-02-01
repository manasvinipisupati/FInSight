import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ff6b6b", "#feca57", "#1dd1a1", "#54a0ff", "#845ef7"];

function Explain({ result }) {
  const NAVY = "#00022E";
  const OFF_WHITE = "#F9FAFB";

  if (!result || !result.signal_contributions) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: OFF_WHITE,
          color: NAVY,
          padding: "40px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <p>No explainability data available.</p>
      </div>
    );
  }

  const data = Object.entries(result.signal_contributions)
    .map(([key, value]) => ({
      name: key.replace("_", " "),
      value,
    }))
    .sort((a, b) => b.value - a.value);

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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "8px" }}>
          Risk Contribution Breakdown
        </h2>

        <p style={{ marginBottom: "32px", opacity: 0.8 }}>
          This shows which financial factors contributed the most to your risk
          score.
        </p>

        {/* PIE CHART */}
        <div
          style={{
            background: "#ffffff",
            border: `1px solid ${NAVY}`,
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "40px",
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <h3 style={{ marginBottom: "16px" }}>
          Relative Contribution
        </h3>

        <div
          style={{
            background: "#ffffff",
            border: `1px solid ${NAVY}`,
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fill: NAVY }} />
              <YAxis tick={{ fill: NAVY }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill={NAVY}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Explain;
