import { icons, IconType } from "./Icon.type";

export default function Icon(props: IconType) {
  const { name, color, className } = props;
  const iconName = color
    ? icons[name][color]
    : icons[name]["default"] || icons[name];

  return <img src={iconName} alt={name} className={className} />;
}
