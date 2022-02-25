import { Typography } from "../../atoms";
import React from "react";
import { InfoOutlined } from "@material-ui/icons";
import styles from "./RewardInfo.module.scss";
import classNames from "classnames";

export default function RewardInfo({
  label,
  link,
}: {
  label: string;
  link?: string;
}) {
  return (
    <div className={"flex cursor-pointer"}>
      <InfoOutlined className={"text-primary text-sm"} />
      <Typography
        fontWeight="semi-bold"
        variant={"body3"}
        className={classNames("ml-2 gradientText", styles.text)}
        component={"a"}
        href={link}
        target={"_blank"}
      >
        {label}
      </Typography>
    </div>
  );
}
