import { Typography } from "@atoms/index";
import { PoolsName } from "@types_/stake-pools";
import styles from "./PoolDescription.module.scss";
import communityPoolIcon from "../../assets/svg/community_pool.svg";
import blueChipPoolIcon from "../../assets/svg/blue_chip_pool.svg";
import airdropPlusPoolIcon from "../../assets/svg/airdrops_plus_pool.svg";
import {
  TypographyVariant,
  FontWeightType,
} from "@atoms/Typography/Typography.type";

interface Props {
  name: PoolsName;
  variant?: TypographyVariant;
  fontWeight?: FontWeightType;
}

function PoolDescription(props: Props) {
  const { name, fontWeight = "medium", variant = "h3" } = props;
  let attribute = { icon: "", className: "" };

  switch (name) {
    case PoolsName.AIRDROP_PLUS:
      attribute = {
        className: styles.airdrops_plus_pool,
        icon: airdropPlusPoolIcon,
      };
      break;
    case PoolsName.BLUE_CHIP:
      attribute = { className: styles.blue_chip_pool, icon: blueChipPoolIcon };
      break;
    case PoolsName.COMMUNITY:
      attribute = { className: styles.community_pool, icon: communityPoolIcon };
      break;
    default:
    case PoolsName.COMMUNITY:
      attribute = { className: styles.community_pool, icon: communityPoolIcon };
      break;
  }

  return (
    <div className={styles.root}>
      <img src={attribute.icon} alt={name} />
      <Typography
        variant={variant}
        fontWeight={fontWeight}
        className={attribute.className}
      >
        {name}
      </Typography>
    </div>
  );
}

export default PoolDescription;
