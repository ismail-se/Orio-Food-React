import React from "react";
import { Redirect } from "react-router-dom";

const RestaurantLanding = () => {
  return (
    <>
      <Redirect to="/dashboard" />;
    </>
  );
};

export default RestaurantLanding;
