import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Branch = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Branch"))}</title>
      </Helmet>
      <div className="text-center">Hello from Branch</div>
    </>
  );
};

export default Branch;
