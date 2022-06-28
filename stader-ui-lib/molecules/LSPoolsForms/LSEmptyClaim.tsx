import { Typography } from "../../atoms";
import styles from "./LSPoolsFormLaToLx.module.scss";

type Props = {
  message: string;
  showNoClaim?: boolean;
};

function LSEmptyClaim({ message, showNoClaim }: Props) {
  return (
    <>
      <div className={`${styles.info_block} flex flex-row`}>
        <div className="flex flex-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="6" fill="#8C8C8C" />
            <path
              d="M5.6275 5.0597H6.565V9.20996H5.6275V5.0597ZM6.1 4.37576C5.93 4.37576 5.7875 4.32136 5.6725 4.21255C5.5575 4.09856 5.5 3.95867 5.5 3.79286C5.5 3.62706 5.5575 3.48975 5.6725 3.38095C5.7875 3.26696 5.93 3.20996 6.1 3.20996C6.27 3.20996 6.4125 3.26437 6.5275 3.37317C6.6425 3.4768 6.7 3.60892 6.7 3.76955C6.7 3.94053 6.6425 4.08561 6.5275 4.20478C6.4175 4.31877 6.275 4.37576 6.1 4.37576Z"
              fill="#111111"
            />
          </svg>
        </div>
        <Typography variant={"caption1"}>{message}</Typography>
      </div>

      {showNoClaim && (
        <div
          className={` ${styles.no_claim_logo} flex flex-center flex-column height-full`}
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.25247 15C12.2405 15 15.4734 11.866 15.4734 8C15.4734 4.13401 12.2405 1 8.25247 1C4.26447 1 1.03156 4.13401 1.03156 8C1.03156 11.866 4.26447 15 8.25247 15ZM8.25247 16C12.8102 16 16.5049 12.4183 16.5049 8C16.5049 3.58172 12.8102 0 8.25247 0C3.69475 0 0 3.58172 0 8C0 12.4183 3.69475 16 8.25247 16Z"
              fill="#3E3E3E"
            />
            <path
              d="M7.74006 6.65995H9.02951V11.9999H7.74006V6.65995ZM8.38994 5.77995C8.15612 5.77995 7.96013 5.70995 7.80196 5.56995C7.64378 5.42328 7.5647 5.24328 7.5647 5.02995C7.5647 4.81661 7.64378 4.63995 7.80196 4.49995C7.96013 4.35328 8.15612 4.27995 8.38994 4.27995C8.62376 4.27995 8.81976 4.34995 8.97793 4.48995C9.1361 4.62328 9.21519 4.79328 9.21519 4.99995C9.21519 5.21995 9.1361 5.40661 8.97793 5.55995C8.82664 5.70661 8.63064 5.77995 8.38994 5.77995Z"
              fill="#3E3E3E"
            />
          </svg>
          <div className={` ${styles.no_claim_logo_text}`}>
            <Typography variant={"body1"} fontWeight={"normal"}>
              You don’t have any claims yet!
            </Typography>
          </div>
        </div>
      )}
    </>
  );
}

export default LSEmptyClaim;
