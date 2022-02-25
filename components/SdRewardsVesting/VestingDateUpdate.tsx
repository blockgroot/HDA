import React from "react";
interface IVestingDateUpdateProps {
  isLiquidStaking?: boolean;
}
const VestingDateUpdate: React.FC<IVestingDateUpdateProps> = ({
  isLiquidStaking,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Original Vesting Date</th>
          <th>New Vesting Date & SD Rewards Received</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {!isLiquidStaking && (
            <td>Jan 20, 2022 - 15% of Final SD Tokens Farmed</td>
          )}

          {isLiquidStaking && (
            <td rowSpan={2} style={{ borderBottom: "none" }}>
              Feb 9, 2022 - 15% of Final SD Tokens Farmed{" "}
            </td>
          )}

          <td style={{ borderBottom: "none" }}>On or Around March 7, 2022</td>
        </tr>
        <tr>
          {!isLiquidStaking && (
            <td>Feb 20, 2022 - 14.17% of Final SD Tokens Farmed</td>
          )}
          <td style={{ borderTop: "none" }}>
            Original vested tokens + Additional rewards
            <span style={{ color: "#00DBFF" }}>
              {" "}
              at 50% APY (on vested SD) from vesting date till TGE
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default VestingDateUpdate;
