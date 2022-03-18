import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { nativeTokenFormatter } from "@utils/CurrencyHelper";
import { PortfolioDataType } from "@types_/portfolio";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ValueProps {
  portfolioBreakDown: PortfolioDataType;
}

function PortfolioMyHoldingChart(props: ValueProps) {
  const { portfolioBreakDown } = props;
  const { total, deposits, total_rewards, airdrops } = portfolioBreakDown;

  const isTotal = total > 0;

  const [series, setSeries] = useState<number[]>([]);
  const options = {
    labels: isTotal ? ["Airdrops", "Rewards", "Deposit"] : [],
    colors: isTotal ? ["#43b8d2", "#8989EB", "#ce41bd"] : ["#2E2E2E"],
    legend: {
      show: !1,
      // position: "bottom",
      inverseOrder: true,
    },
    stroke: {
      // show: 1,
      colors: ["#111111"],
    },
    dataLabels: {
      enabled: isTotal,
      style: {
        fontSize: "12px",
        lineHeight: "16px",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: "500 !important",
        colors: ["#f9f9f9"],
      },
    },
    tooltip: {
      enabled: isTotal,
      y: {
        formatter: function (value: any) {
          return `${nativeTokenFormatter(value)} ${NATIVE_TOKEN_LABEL}`; // The formatter function overrides format property
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "35%",
        },
      },
    },
  };

  const handleSeriesData = () => {
    let series = [100];
    if (portfolioBreakDown.total > 0) {
      let totalAirdrops =
        airdrops.anc.amountInNativeToken +
        airdrops.mir.amountInNativeToken +
        airdrops.mine.amountInNativeToken +
        airdrops.vkr.amountInNativeToken +
        airdrops.orion.amountInNativeToken +
        airdrops.twd.amountInNativeToken;

      totalAirdrops = nativeTokenFormatter(totalAirdrops);

      series = [totalAirdrops, total_rewards, deposits];
    }
    setSeries(series);
  };

  useEffect(() => {
    handleSeriesData();
  }, []);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={"180"}
      width={"180"}
    />
  );
}

export default PortfolioMyHoldingChart;
