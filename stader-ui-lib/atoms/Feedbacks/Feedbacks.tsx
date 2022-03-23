type Props = {
  width?: string | number;
  height?: string | number;
};

function SuccessAnimation({ width, height }: Props) {
  return (
    <div>
      <img
        src={"/static/success.gif"}
        alt="loader"
        width={width || 100}
        height={height || 100}
      />
    </div>
  );
}

export { SuccessAnimation };

// export SuccessAnimation;
