import styles from "./SPValidatorTableRowHead.module.scss";
import c from "classnames";
import { Box, Icon, Typography } from "../../atoms";
import { ValidatorInfo, ValidatorStakingInfoMap } from "../../../components/Stake";
import { config } from "../../../config/config";

type HeaderProps = {
  onClick: () => void;
  setQueryParam: any;
  openBody: boolean;
  validatorInfo: ValidatorStakingInfoMap;
  topValidator: ValidatorInfo
};
const SPValidatorRowHead = (props: HeaderProps) => {
  const { onClick, openBody, validatorInfo, topValidator, setQueryParam } =
    props;

  return (
    <Box className={styles.root} noBorderRadius noPadding>
      {topValidator && <div onClick={onClick} className={ openBody ? styles['head'] + " " + styles['activeRowFirst'] : styles['head'] }>
        <div className={c(styles.col_23, styles.validator)}>
          <Typography variant={"body2"} fontWeight={"medium"}>
            <div className={c(styles.validatorImage)}>
              {
                config.network.name == 'mainnet' ?
                <img
                  src={"/static/"+topValidator.operatorAddress+".png"}
                  alt=""
                /> :
                <img
                  src={"/static/terravaloper1t90gxaawul292g2vvqnr3g0p39tw5v6vsk5p96.png"}
                  alt=""
                />
              }
            </div>
            <div className={c(styles.validatorName)}>{topValidator.name}</div>
          </Typography>
        </div>
        <div className={styles.col_2}>
          <div className={"flex items-end"}>
            <Typography variant={"body2"} fontWeight={"medium"}>
              {topValidator.apr}%
            </Typography>
          </div>
        </div>
        <div className={styles.col_2}>
          <Typography variant={"body2"} fontWeight={"medium"}>
            {topValidator.uptime}%
          </Typography>
        </div>
        <div className={styles.col_2}>
          <Typography variant={"body2"} fontWeight={"medium"}>
            {topValidator.commission}%
          </Typography>
        </div>
        <div className={styles.col_2}>
          <Typography variant={"body2"} fontWeight={"medium"}>
            {topValidator.votingPower}%
          </Typography>
        </div>
        <div className={styles.col_last}>
          <div className={styles.dropdown_button} role={"button"}>
            <Icon name={openBody ? "arrow_up" : "arrow_down"} />
          </div>
        </div>
      </div>}
      {openBody && (
        <div>
          {Object.keys(validatorInfo).length > 0 && Object.keys(validatorInfo).map((item: string, index: number) => (
            <div className={styles.description} key={index} onClick={() => {
              setQueryParam(validatorInfo[item].operatorAddress);
            }}>
              <div className={c(styles.col_23, styles.validator)}>
                <Typography variant={"body2"} fontWeight={"medium"}>
                  <div className={c(styles.validatorImage)}>
                    {
                      config.network.name == 'mainnet' ?
                      <img
                        src={"/static/"+validatorInfo[item].operatorAddress+".png"}
                        alt=""
                      /> :
                      <img
                        src={"/static/terravaloper1t90gxaawul292g2vvqnr3g0p39tw5v6vsk5p96.png"}
                        alt=""
                      />
                    }
                  </div>
                  <div className={c(styles.validatorName)}>{validatorInfo[item].name}</div>
                </Typography>
              </div>
              <div className={styles.col_2}>
                <div className={"flex items-end"}>
                  <Typography variant={"body2"} fontWeight={"medium"}>
                    {validatorInfo[item].apr}%
                  </Typography>
                </div>
              </div>
              <div className={styles.col_2}>
                <Typography variant={"body2"} fontWeight={"medium"}>
                  {validatorInfo[item].uptime}%
                </Typography>
              </div>
              <div className={styles.col_2}>
                <Typography variant={"body2"} fontWeight={"medium"}>
                  {validatorInfo[item].commission}%
                </Typography>
              </div>
              <div className={styles.col_2}>
                <Typography variant={"body2"} fontWeight={"medium"}>
                  {validatorInfo[item].votingPower}%
                </Typography>
              </div>
              <div className={styles.col_last}></div>
            </div>))}
        </div>
      )}
    </Box>
  );
};

export default SPValidatorRowHead;