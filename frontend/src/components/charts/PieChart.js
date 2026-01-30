import { PieChart, Pie, Cell, Tooltip } from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

export default function PieChartCustom({ data }) {
  return (
    <PieChart width={500} height={350}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={120}
        label
      >
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
