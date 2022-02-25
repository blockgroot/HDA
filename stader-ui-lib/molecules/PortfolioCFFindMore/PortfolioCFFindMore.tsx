import { urls } from "../../../constants/constants";
import React from "react";
import { Box, Typography } from "../../atoms";

export default function PortfolioCFFindMore() {
  return (
    <a
      href={urls.faq}
      target="_blank"
      rel="noreferrer"
      className="learnMoreLink"
    >
      <Box noPadding className={"flex items-center justify-between p-8"}>
        <Typography variant={"h3"} fontWeight={"bold"}>
          Find out about our Community Farming Event
        </Typography>

        <img
          src={"/static/color_arrow.png"}
          alt="button"
          width={48}
          height={48}
        />
      </Box>
    </a>
  );
}
