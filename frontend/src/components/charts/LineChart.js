import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function LineChartCustom({ data }) {
  return (
    <>
      <h3>Line Chart</h3>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line dataKey="value" stroke="#ff7300" />
      </LineChart>
    </>
  );
}
