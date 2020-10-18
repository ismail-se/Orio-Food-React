import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const OrderHistories = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Order Histories"))}</title>
      </Helmet>
      <div className="text-center">Hello from Order Histories</div>
    </>
  );
};

export default OrderHistories;
