import { ReactElement } from "react";

interface Props {
  icon: ReactElement;
  label: ReactElement;
  value: ReactElement;
}

function Airdrop({ icon, label, value }: Props) {
  return (
    <div className={"flex items-end"}>
      {value}
      <div className={"ml-2 mr-1"}>{label}</div>
      {icon}
    </div>
  );
}

export default Airdrop;
