import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Pos = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("POS"))}</title>
      </Helmet>
      <div className="text-center">Hello from POS</div>
    </>
  );
};

export default Pos;
