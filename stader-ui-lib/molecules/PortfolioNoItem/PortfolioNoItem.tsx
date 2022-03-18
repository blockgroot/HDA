import React from "react";
import { InfoOutlined } from "@material-ui/icons";
import Router from "next/router";
import { Button } from "../../atoms";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

function Deposit() {
  return (
    <div className="zeroStateContent">
      <p className="header">You’ve not deposited any {NATIVE_TOKEN_LABEL} yet</p>
      <Button
        variant={"solid"}
        size={"large"}
        onClick={() => {
          Router.push("/pools");
        }}
      >
        Deposit Now
      </Button>
    </div>
  );
}

interface Props {
  type: "deposit" | "withdrawal";
}

function PortfolioNoItem(props: Props) {
  return (
    <div className="welcome-content">
      <div className="zeroState">
        <div>
          <InfoOutlined className="infoIcon" />
        </div>
        {props.type === "deposit" && <Deposit />}
        {props.type === "withdrawal" && (
          <div className="zeroStateContent">
            <p className="header">Nothing to withdraw</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioNoItem;
