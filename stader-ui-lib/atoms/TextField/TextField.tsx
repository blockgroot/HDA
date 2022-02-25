import { TextFieldType } from "./TextField.type";
import classNames from "classnames";
import styles from "./TextField.module.scss";
import { HTMLInputTypeAttribute } from "react";

function TextField(props: TextFieldType) {
  const { label, labelClass, type, ...others } = props;
  const labelClasses = classNames("text-base", labelClass, styles.input);
  const inputClasses = classNames(
    "h-full bg-transparent w-full outline-none border-0 flex-1 mr-3 sul-input"
  );
  const wrapperClasses = classNames(
    "bg-dark-500 h-14 px-5 flex items-center rounded-xl text-white text-sm text-field"
  );

  const getTypeProps = (
    type?: HTMLInputTypeAttribute
  ): { type: string; pattern?: string } => {
    switch (type) {
      case "number":
        return { type: "text", pattern: "[0-9.]*" };
      default: {
        return { type: "text" };
      }
    }
  };

  return (
    <div className={wrapperClasses}>
      <input className={inputClasses} {...others} {...getTypeProps(type)} />
      <span className={labelClasses}>{label}</span>
    </div>
  );
}

export default TextField;
