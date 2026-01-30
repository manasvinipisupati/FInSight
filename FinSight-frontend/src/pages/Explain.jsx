import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = ["#ff6b6b", "#feca57", "#1dd1a1", "#54a0ff"];

function Explain({ result }) {
  if (!result) {
    return <p>No analysis available. Please upload a file first.</p>;
  }

  if (!result.signal_contributions) {
    return <p>Explainability data is not available.</p>;
  }

  const data = Object.entries(result.signal_contributions).map(
    ([key, value]) => ({
      name: key.replace("_", " "),
      value: value,
    })
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Risk Signal Contribution</h2>

      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" outerRadius={110}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Explain;
