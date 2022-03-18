import { icons, IconType } from "./Icon.type";

export default function Icon(props: IconType) {
  const { name, color, className, width, height } = props;
  const iconName = color
    ? icons[name][color]
    : icons[name]["default"] || icons[name];

  return <img src={iconName} alt={name} width={width} height={height} className={className} />;
}
