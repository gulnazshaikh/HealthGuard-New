import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function BarChartCustom({ data, column }) {
  return (
    <>
      <h3>Bar Chart</h3>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#5b5bff" />
      </BarChart>
    </>
  );
}
