import React from "react";
import { lunaFormatter } from "@utils/CurrencyHelper";
import { Box, Divider, Typography } from "../../atoms";
import styles from "./PortfolioCFTotalHolding.module.scss";
import { tooltips } from "@constants/constants";
import { InfoOutlined } from "@material-ui/icons";
import { Grid, Tooltip, useMediaQuery } from "@material-ui/core";
import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import SDTooltip from "@atoms/SDTooltip/SDTooltip";

interface Props {
  totalKyvApr: number;
  totalHolding: any;
}

function PortfolioCFTotalHolding({ totalKyvApr, totalHolding }: Props) {
  const landsacpeView = useMediaQuery(
    `(min-width:${MQ_FOR_TABLET_LANDSCAPE}px)`
  );
  return (
    <Box className={styles.root} noPadding>
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        className="h-full"
      >
        <Grid item xs={6} md={12}>
          <div className={"flex items-end mb-7"}>
            <Typography variant={"h1"} className={styles.luna_value}>
              {lunaFormatter(totalHolding).toString()}
            </Typography>
            <Typography variant={"body2"} className={styles.luna_label}>
              LUNA
            </Typography>
          </div>
          <div className={"flex items-center"}>
            <Typography
              fontWeight={"bold"}
              color={"textSecondary"}
              className={styles.label}
            >
              Total Holdings
            </Typography>
            <SDTooltip
              content={tooltips.totalHoldings}
              className={styles.info_icon}
            />
          </div>
        </Grid>
        <Grid
          item
          xs={1}
          md={12}
          className="md:flex md:flex-col md:justify-center"
        >
          <Divider
            color={"light"}
            orientation={landsacpeView ? "horizontal" : "vertical"}
          />
        </Grid>
        <Grid
          item
          xs={5}
          md={12}
          className="md:flex md:flex-col md:justify-end"
        >
          <Typography variant={"h1"} className={styles.luna_value}>
            {totalKyvApr && totalKyvApr > 0
              ? `${totalKyvApr.toFixed(2)}%`
              : "N.A"}
          </Typography>
          <div className={"flex items-center mt-7"}>
            <Typography
              fontWeight={"bold"}
              color={"textSecondary"}
              className={styles.label}
              // className={"mt-4"}
            >
              Expected APR
            </Typography>
            <SDTooltip
              content={tooltips.aprAirdrops}
              className={styles.info_icon}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PortfolioCFTotalHolding;
