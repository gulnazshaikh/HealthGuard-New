import React from "react";
import Plot from "react-plotly.js";

export default function HeatMap({ data }) {
  if (!data || !data.z || data.z.length === 0) {
    return <p>⚠️ Heatmap data not available</p>;
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h3>🔥 Correlation Heatmap</h3>

      <Plot
        data={[
          {
            z: data.z,
            x: data.x,
            y: data.y,
            type: "heatmap",
            colorscale: "Viridis",
            showscale: true
          }
        ]}
        layout={{
          width: 650,
          height: 600,
          paper_bgcolor: "#05072b",
          plot_bgcolor: "#05072b",
          font: { color: "white" }
        }}
      />
    </div>
  );
}
