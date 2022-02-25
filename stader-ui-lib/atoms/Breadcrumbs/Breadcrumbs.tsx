import MUIBreadcrumbs, {
  BreadcrumbsProps,
} from "@material-ui/core/Breadcrumbs";
import styles from "./Breadcrumbs.module.scss";

interface Props extends BreadcrumbsProps {}

function Breadcrumbs(props: Props) {
  const { children } = props;
  return (
    <MUIBreadcrumbs
      classes={{
        separator: styles.separator,
      }}
      className={styles.breadcrumbs}
      separator=">"
    >
      {children}
    </MUIBreadcrumbs>
  );
}

export default Breadcrumbs;
