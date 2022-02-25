import { MQ_FOR_TABLET_LANDSCAPE } from "@constants/media-queries";
import { useMediaQuery } from "@material-ui/core";
import { Box, Typography } from "@atoms/index";
import React from "react";
import StakePlusComponent from "../components/StakePlus";
import MainLayout from "../layout";
import Logo from "@atoms/Logo/Logo";

const StakePlus = () => {
  const tabletDown = useMediaQuery(`(max-width: ${MQ_FOR_TABLET_LANDSCAPE}px)`);

  return (
    <div>
      <MainLayout>
        {tabletDown ? (
          <Box>
            <Logo />
            <Typography variant="h2">
              Stake+ is coming soon on mobile device.
            </Typography>
          </Box>
        ) : (
          <StakePlusComponent />
        )}
      </MainLayout>
    </div>
  );
};

export default StakePlus;
