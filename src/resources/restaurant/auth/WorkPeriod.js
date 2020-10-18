import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const WorkPeriod = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Work Periods"))}</title>
      </Helmet>
      <div className="text-center">Hello from work periods</div>
    </>
  );
};

export default WorkPeriod;
