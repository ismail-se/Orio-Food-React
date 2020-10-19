import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const RestaurantLanding = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Restaurant Landing"))}</title>
      </Helmet>
      <div className="text-center">Hello from Restaurant Landing</div>
    </>
  );
};

export default RestaurantLanding;
