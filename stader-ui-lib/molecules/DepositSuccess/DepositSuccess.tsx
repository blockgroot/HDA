import { SuccessAnimation, Typography } from "../../atoms";
import { ButtonOutlined } from "../../atoms/Button/Button";

interface Props {
  reset: () => void;
  message: string;
}

function DepositSuccess({ reset, message }: Props) {
  return (
    <div className="flex flex-col flex-center">
      <div className="mb-4">
        <SuccessAnimation width={"100px"} height={"100px"} />
      </div>

      <Typography variant={"body2"} fontWeight={"semi-bold"}>
        {message}
      </Typography>

      <div className="mt-4 text-center">
        <ButtonOutlined onClick={reset} size={"large"}>
          Done
        </ButtonOutlined>
      </div>
    </div>
  );
}

export default DepositSuccess;
