import Plot from "react-plotly.js";

export default function HeatMap({ data }) {
  return (
    <>
      <h3>Heatmap</h3>
      <Plot
        data={[{
          z: data.rows,
          x: data.columns,
          y: data.columns,
          type: "heatmap",
          colorscale: "Reds"
        }]}
        layout={{ width: 600, height: 400, paper_bgcolor: "#05072b", font: { color: "white" } }}
      />
    </>
  );
}
