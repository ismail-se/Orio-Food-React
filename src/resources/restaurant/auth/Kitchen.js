import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Kitchen = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Kitchen"))}</title>
      </Helmet>
      <div className="text-center">Hello from Kitchen</div>
    </>
  );
};

export default Kitchen;
