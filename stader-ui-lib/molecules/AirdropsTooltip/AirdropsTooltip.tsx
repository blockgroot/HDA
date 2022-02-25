import styles from "./AirdropsTooltip.module.css";

function AirdropsTooltip() {
  const renderImage = (path: string, label: string) => {
    return (
      <div className={styles.item}>
        <img src={path} alt={label} className={styles.image} />
      </div>
    );
  };
  return (
    <div className={styles.root}>
      {renderImage("/static/anc.png", "ANC")}
      {renderImage("/static/mir.png", "MIR")}
      {renderImage("/static/pylon.png", "Pylon")}
      {renderImage("/static/valkyrie.png", "Valkyrie")}
    </div>
  );
}

export default AirdropsTooltip;
