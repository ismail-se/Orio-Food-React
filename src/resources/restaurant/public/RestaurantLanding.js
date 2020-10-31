import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";

const RestaurantLanding = () => {
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    checkReload();
  }, []);

  //check reload
  const checkReload = () => {
    if (history.location.state) {
      if (history.location.state.alert === "reload") {
      }
    }
  };
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
