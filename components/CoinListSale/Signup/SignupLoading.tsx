import React from "react";
import Loader from "../../common/Loader";

const SignupLoading = () => {
  return (
    <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
      <Loader
        classes="loaderContainer"
        loaderText="Please wait for a moment..."
      />
    </div>
  );
};

export default SignupLoading;
