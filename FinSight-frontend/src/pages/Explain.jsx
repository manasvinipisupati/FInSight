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
  if (!result || !result.signal_contributions) {
    return <p>No explainability data available.</p>;
  }

  const data = Object.entries(result.signal_contributions)
    .map(([key, value]) => ({
      name: key.replace("_", " "),
      value,
    }))
    .sort((a, b) => b.value - a.value); // biggest first

  return (
    <div style={{ padding: "24px" }}>
      <h2>Risk Contribution Breakdown</h2>
      <p>
        This shows which financial factors contributed the most to your risk
        score.
      </p>

      {/* PIE CHART */}
      <ResponsiveContainer width="100%" height={300}>
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

      {/* BAR CHART */}
      <h3 style={{ marginTop: "32px" }}>Relative Contribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Explain;
