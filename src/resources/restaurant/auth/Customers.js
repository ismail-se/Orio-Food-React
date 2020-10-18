import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Customers = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Customers"))}</title>
      </Helmet>
      <div className="text-center">Hello from Customers</div>
    </>
  );
};

export default Customers;
