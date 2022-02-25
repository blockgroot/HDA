import React, { FC } from "react";
import classNames from "classnames";

interface ListItemProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "space-between";
}

const ListItem: FC<ListItemProps> = (props) => {
  const { children, className, variant } = props;
  const classes = classNames(
    "flex items-center w-full flex-1",
    {
      "justify-between": variant === "space-between",
    },
    className
  );
  return <div className={classes}>{children}</div>;
};

export default ListItem;

ListItem.defaultProps = {
  variant: "space-between",
};
