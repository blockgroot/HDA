import React, { Component } from "react";
import dynamic from "next/dynamic";
import { ClickAwayListener, Tooltip } from "@material-ui/core";
import { lunaFormatter, lunaFormatterOrion } from "../../utils/CurrencyHelper";
import { tooltips } from "../../constants/constants";
import { InfoOutlined } from "@material-ui/icons";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ValueProps {
  deposits: number;
  totalRewards: number;
  pendingRewards: number;
  airdrops: any;
  total: number;
  seriesData: any;
  getColors: any;
  getLabels: any;
  showLabels: any;
}

interface ValueState {
  options: any;
  series: any;
  viewAirdropsDropdown: boolean;
}

class PortfolioDonutChart extends Component<ValueProps, ValueState> {
  state: ValueState = {
    series: this.props.seriesData,
    options: {
      chart: {
        id: "portfolio-breakup",
      },
      labels: this.props.getLabels(),
      colors: this.props.getColors(),
      legend: {
        show: !1,
        position: "bottom",
        inverseOrder: true,
      },
      stroke: {
        show: 1,
        colors: ["#111111"],
      },
      dataLabels: {
        enabled: this.props.showLabels(),
        style: {
          fontSize: "12px",
          lineHeight: "16px",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: "500 !important",
          colors: ["#f9f9f9"],
        },
      },
      tooltip: {
        enabled: this.props.showLabels(),
        y: {
          formatter: function (value: any) {
            return `${lunaFormatter(value)} LUNA`; // The formatter function overrides format property
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
    },
    viewAirdropsDropdown: false,
  };

  componentDidMount() {
    let { series } = this.state;

    if (this.props.total > 0) {
      // let airdrops =
      //   this.props.airdrops.anc.amountInLuna +
      //   this.props.airdrops.mir.amountInLuna +
      //   this.props.airdrops.mine.amountInLuna +
      //   this.props.airdrops.vkr.amountInLuna +
      //   this.props.airdrops.orion.amountInLuna +
      //   this.props.airdrops.twd.amountInLuna;

      series = [/*airdrops, */ this.props.totalRewards, this.props.deposits];
    } else {
      series = [100];
    }

    this.setState({ series });
  }

  componentDidUpdate = (prevProps: any) => {
    if (prevProps && this.props) {
      if (
        prevProps.deposits !== this.props.deposits ||
        prevProps.totalRewards !== this.props.totalRewards ||
        prevProps.airdrops !== this.props.airdrops ||
        prevProps.total !== this.props.total
      ) {
        let { series } = this.state;

        if (this.props.total > 0) {
          // let airdrops =
          //   this.props.airdrops.anc.amountInLuna +
          //   this.props.airdrops.mir.amountInLuna +
          //   this.props.airdrops.mine.amountInLuna +
          //   this.props.airdrops.vkr.amountInLuna +
          //   this.props.airdrops.orion.amountInLuna +
          //   this.props.airdrops.twd.amountInLuna;

          series = [/*airdrops,*/ this.props.totalRewards, this.props.deposits];
        } else {
          series = [100];
        }

        ApexCharts.exec("portfolio-breakup", "updateSeries", series);
        this.setState({ series });
        this.forceUpdate();
      }
    }
  };

  onClickAwayViewAirdrops = () => {
    this.setState({ viewAirdropsDropdown: false });
  };

  toggleOpenViewAirdrops = () => {
    this.setState({
      viewAirdropsDropdown: !this.state.viewAirdropsDropdown,
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.props.total > 0 ? (
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="donut"
            height={"180"}
            width={"180"}
          />
        ) : (
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="donut"
            height={"180"}
            width={"180"}
          />
        )}

        <div className="customLegends">
          <div className="customLegend">
            <div className="legendMarker legendMarker1"></div>
            <div className="customLegendInfo">
              <p className="legendLabel">Deposits</p>
              <p className="legendValue">
                {lunaFormatter(this.props.deposits)}{" "}
                <span className="legendValueDenom">LUNA</span>
              </p>
            </div>
          </div>
          <div className="customLegend">
            <div className="legendMarker legendMarker2"></div>
            <div className="customLegendInfo">
              <p className="legendLabel">Rewards</p>
              <p className="legendValue">
                {lunaFormatter(this.props.totalRewards)}{" "}
                <span className="legendValueDenom">LUNA</span>{" "}
                <span>
                  <Tooltip
                    title={
                      lunaFormatter(this.props.pendingRewards) +
                      " Luna is yet to be moved to strategies."
                    }
                    placement={"bottom"}
                    arrow
                    classes={{
                      tooltip: "tooltip",
                      arrow: "arrow",
                    }}
                  >
                    <InfoOutlined className="infoIcon" />
                  </Tooltip>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="customLegends">
          <div className="customLegend">
            <div className="legendMarker legendMarker3"></div>
            <div className="customLegendInfo">
              <p className="legendLabel">Airdrops</p>
              <div className="legendAirdropValues">
                {Object.keys(this.props.airdrops).map(
                  (airdropToken: string, index: number) =>
                    index < 2 ? (
                      <p
                        className="legendValue"
                        key={`airdrop-1-${airdropToken}`}
                      >
                        {airdropToken === "orion"
                          ? lunaFormatterOrion(
                              this.props.airdrops[airdropToken].amount
                            )
                          : lunaFormatter(
                              this.props.airdrops[airdropToken].amount
                            )}{" "}
                        <span className="legendValueDenom">
                          {airdropToken}{" "}
                          <img
                            src={
                              airdropToken === "anc"
                                ? "/static/anc.png"
                                : airdropToken === "mir"
                                ? "/static/mir.png"
                                : airdropToken === "mine"
                                ? "/static/pylon.png"
                                : airdropToken === "vkr"
                                ? "/static/valkyrie.png"
                                : "/static/orion.png"
                            }
                            alt={airdropToken}
                            className="legendImage"
                          />
                        </span>
                      </p>
                    ) : null
                )}
                {Object.keys(this.props.airdrops).length > 2 ? (
                  <div>
                    <ClickAwayListener
                      onClickAway={this.onClickAwayViewAirdrops}
                    >
                      <div className="filter">
                        <div
                          className="legendsViewAllAirdrops legendsViewAll"
                          onClick={() => this.toggleOpenViewAirdrops()}
                        >
                          View All
                        </div>
                        {this.state.viewAirdropsDropdown && (
                          <div className="dropdown-container">
                            <div className="dropdown-box filterDropdown">
                              <div className="filterDropdownContainer">
                                {Object.keys(this.props.airdrops).map(
                                  (airdropToken: string, index: number) => (
                                    <div
                                      className="filterItem"
                                      key={`airdrop-2-${airdropToken}`}
                                    >
                                      <p className="legendValue">
                                        {airdropToken === "orion"
                                          ? lunaFormatterOrion(
                                              this.props.airdrops[airdropToken]
                                                .amount
                                            )
                                          : lunaFormatter(
                                              this.props.airdrops[airdropToken]
                                                .amount
                                            )}{" "}
                                        <span className="legendValueDenom">
                                          {airdropToken}{" "}
                                          <img
                                            src={
                                              airdropToken === "anc"
                                                ? "/static/anc.png"
                                                : airdropToken === "mir"
                                                ? "/static/mir.png"
                                                : airdropToken === "mine"
                                                ? "/static/pylon.png"
                                                : airdropToken === "vkr"
                                                ? "/static/valkyrie.png"
                                                : airdropToken === "twd"
                                                ? "/static/twd.png"
                                                : "/static/orion.png"
                                            }
                                            alt={airdropToken}
                                            className="legendImage"
                                          />
                                        </span>
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ClickAwayListener>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PortfolioDonutChart;
