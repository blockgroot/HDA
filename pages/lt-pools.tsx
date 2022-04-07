import { config } from "config/config";
import Image from "next/image";
import React from "react";
import MainLayout from "../layout";
import LSPools from "../stader-ui-lib/templates/LSPools/LSPools";

function Stake() {
  //check for coming soon

  if (config.comingSoon) {
    return (
      <div className="bg-black">
        <div className="bg-[url('/coming-soon.jpeg')] w-full flex flex-col h-screen content-center justify-center bg-center bg-no-repeat "></div>
      </div>
    );
  }

  return (
    <div>
      <MainLayout>
        <LSPools />
      </MainLayout>
    </div>
  );
}

export default Stake;
