// TODO: make this an iterator and the iterator is a prop
export const AirdropsTooltip = () => {
  return (
    <div className="airdrops-tooltip">
      <div className="tooltip-item">
        <img src={"/static/anc.png"} alt="ANC" className="tooltip-image" />
      </div>
      <div className="tooltip-item">
        <img src={"/static/mir.png"} alt="MIR" className="tooltip-image" />
      </div>
      <div className="tooltip-item">
        <img src={"/static/pylon.png"} alt="ANC" className="tooltip-image" />
      </div>
      <div className="tooltip-item">
        <img src={"/static/valkyrie.png"} alt="MIR" className="tooltip-image" />
      </div>
    </div>
  );
};
