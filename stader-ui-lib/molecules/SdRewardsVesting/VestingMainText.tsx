import React from "react";
import { Link } from "../../atoms/";
function VestingMainText() {
  return (
    <p>
      We are thrilled to announce that on January 25th Stader became the first
      protocol on Terra to do a sale on CoinList. The sale received an
      overwhelming response with over 1.1 Million+ registrations, the highest on
      CoinList so far.
      <Link
        href={"https://sales.coinlist.co/stader"}
        variant={"gradient"}
        className={"inline"}
        target={"_blank"}
      >
        Learn More
      </Link>
    </p>
  );
}

export default VestingMainText;
