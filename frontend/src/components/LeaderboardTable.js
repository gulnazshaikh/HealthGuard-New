import React from "react";

const leaderboardData = [
  {
    model_id: "StackedEnsemble_BestOfFamily_1_AutoML_2_20250831_165046",
    rmse: 0.397,
    mae: 0.325,
    mse: 0.158,
    rmsle: 0.123,
    mean_residual_deviance: 0.158
  },
  {
    model_id: "GBM_1_AutoML_2_20250831_165046",
    rmse: 0.412,
    mae: 0.328,
    mse: 0.170,
    rmsle: 0.130,
    mean_residual_deviance: 0.170
  },
  {
    model_id: "GLM_1_AutoML_2_20250831_165046",
    rmse: 0.450,
    mae: 0.345,
    mse: 0.203,
    rmsle: 0.145,
    mean_residual_deviance: 0.203
  }
];

const LeaderboardTable = () => (
  <div>
    <h2>H2O AutoML Leaderboard</h2>
    <table border="1" cellPadding="10" cellSpacing="0">
      <thead>
        <tr>
          <th>Model ID</th>
          <th>RMSE</th>
          <th>MAE</th>
          <th>MSE</th>
          <th>RMSLE</th>
          <th>Mean Residual Deviance</th>
        </tr>
      </thead>
      <tbody>
        {leaderboardData.map((model, index) => (
          <tr key={index} style={{ backgroundColor: index === 0 ? "#d4edda" : "" }}>
            <td>{model.model_id}</td>
            <td>{model.rmse}</td>
            <td>{model.mae}</td>
            <td>{model.mse}</td>
            <td>{model.rmsle}</td>
            <td>{model.mean_residual_deviance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LeaderboardTable;
