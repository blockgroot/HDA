import { Tooltip } from "@material-ui/core";
import React, { useState } from "react";
import { Typography } from "../../atoms";
import styles from "./SPPoolsTooltip.module.scss";
import Image from "next/image";

interface Props {
  name: "airdrop" | "decentralization" | "slashing";
  label: string;
  tooltip: any;
  image: string;
  imageActive: string;
}

function SPPoolsTooltip(props: Props) {
  const { name, label, tooltip, image, imageActive } = props;
  const [hoverState, setHoverState] = useState<string>("");

  return (
    <Tooltip
      title={tooltip}
      arrow
      placement={"bottom-start"}
      classes={{
        tooltip: styles.tooltip,
        arrow: "arrow",
      }}
    >
      <div
        className="flex items-center"
        onMouseEnter={() => setHoverState(name)}
        onMouseLeave={() => setHoverState("")}
      >
        <Image
          src={hoverState ? imageActive : image}
          alt={label}
          width={16}
          height={16}
        />
        <Typography
          variant={"body2"}
          className={"ml-3"}
          color={hoverState ? "primary" : "textPrimary"}
          fontWeight={"semi-bold"}
        >
          {label}
        </Typography>
      </div>
    </Tooltip>
  );
}

export default SPPoolsTooltip;
