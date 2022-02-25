import React, { ChangeEvent } from "react";
import { Typography } from "../../atoms";
import StrategySlider from "../../molecules/StrategySlider/StrategySlider";
import styles from "./StrategyItem.module.scss";
interface Props {
  description: string;
  shouldSlide: boolean;
  value: number;
  onChange: (event: ChangeEvent<{}>, value: number | number[]) => void;
  title: string;
  thumbClassName: string;
  trackClassName: string;
  logo: string;
}

function StrategyItem({
  value,
  title,
  description,
  shouldSlide,
  onChange,
  thumbClassName,
  trackClassName,
  logo,
}: Props) {
  return (
    <div>
      <Typography
        variant={"h3"}
        fontWeight={"semi-bold"}
        style={{ lineHeight: "16px !important" }}
        className={"mb-4"}
      >
        {title}
      </Typography>
      <div className="strategyBreakUpInfoDetails">
        <div className={styles.subtitle_value}>
          <div className="flex items-center">
            <img src={logo} alt={title} />
            <Typography
              variant={"body3"}
              fontWeight={"medium"}
              style={{
                lineHeight: "14px !important",
                minWidth: 220,
              }}
              className={"ml-2"}
            >
              {description}
            </Typography>
          </div>
          <Typography variant={"h2"} fontWeight={"medium"}>
            {value}%
          </Typography>
        </div>
      </div>
      <div className="strategyBreakUpSlider">
        <StrategySlider
          value={value}
          onChange={onChange}
          shouldSlide={shouldSlide}
          trackClassName={trackClassName}
          thumbClassName={thumbClassName}
        />
      </div>
    </div>
  );
}

export default StrategyItem;
