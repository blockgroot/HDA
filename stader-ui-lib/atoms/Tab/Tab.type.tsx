import { ReactNode } from "react";

export interface TabType {
  active?: boolean;
  label: string;
  value: number;
  subText?: string;
  onChange?: (value: number) => void;
}

export interface TabsType {
  children: ReactNode;
  value: number;
  onChange?: (value: number) => void;
}
