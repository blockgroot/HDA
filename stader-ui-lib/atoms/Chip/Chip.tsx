import { ChipType } from "./Chip.type";

function Chip(props: ChipType) {
  const { label } = props;
  return (
    <div
      className={
        "h-6 px-2 text-xs rounded-10 bg-dark-200 text-white inline-flex items-center"
      }
    >
      {label}
    </div>
  );
}

export default Chip;
