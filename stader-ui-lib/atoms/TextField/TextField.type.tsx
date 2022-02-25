import React from "react";

export interface TextFieldType extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  labelClass?:string;
}
