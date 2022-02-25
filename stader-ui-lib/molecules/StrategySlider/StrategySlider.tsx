import { Slider } from "@material-ui/core";
import styles from "./StrategySlider.module.scss";
import React, { ChangeEvent } from "react";
import classNames from "classnames";

interface Props {
    shouldSlide: boolean;
    value: number;
    onChange: (event: ChangeEvent<{}>, value: number | number[]) => void;
    thumbClassName: string;
    trackClassName: string;
}

function StrategySlider({
    shouldSlide,
    value,
    onChange,
    thumbClassName,
    trackClassName,
}: Props) {
    const thumbClasses = classNames(
        styles.thumb,
        {
            hidden: !shouldSlide,
        },
        thumbClassName
    );

    return (
        <Slider
            value={value}
            onChange={onChange}
            step={5}
            disabled={!shouldSlide}
            classes={{
                rail: styles.slider,
                track: trackClassName,
                thumb: thumbClasses,
            }}
        />
    );
}

export default StrategySlider;
