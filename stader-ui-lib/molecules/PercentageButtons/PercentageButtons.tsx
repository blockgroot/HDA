import styles from "./PercentageButtons.module.scss";
import React from "react";
import classNames from "classnames";

const percentages: Array<{ label: string; value: number }> = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "Max", value: 1 },
];
type Props = {
  onClick: (value: number) => void;
  total: number | string;
  activeValue: number | string;
};
export default function PercentageButtons({
  onClick,
  total,
  activeValue,
}: Props) {
  const handleClick = (val: number) => () => {
    onClick(val);
  };
  return (
    <div className={styles.button_group}>
      {percentages.map((per) => {
        return (
          <Button
            onClick={handleClick(per.value)}
            label={per.label}
            key={per.value}
            active={
              Boolean(Number((per.value * Number(total)).toFixed(6))) &&
              Number(Number(activeValue).toFixed(6)) ===
                Number((per.value * Number(total)).toFixed(6))
            }
          />
        );
      })}
    </div>
  );
}

interface ButtonProps {
  label: string;
  onClick: () => void;
  active: boolean;
}

function Button(props: ButtonProps) {
  const { label, onClick, active } = props;

  const classes = classNames(styles.button, { [styles.active]: active });

  return (
    <button className={classes} onClick={onClick} type={"button"}>
      {label}
    </button>
  );
}
