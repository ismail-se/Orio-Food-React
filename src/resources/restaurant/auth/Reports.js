import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Reports = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Reports"))}</title>
      </Helmet>
      <div className="text-center">Hello from Reports</div>
    </>
  );
};

export default Reports;
