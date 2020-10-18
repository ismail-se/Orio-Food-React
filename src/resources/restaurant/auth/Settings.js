import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("Settings"))}</title>
      </Helmet>
      <div className="text-center">Hello from Settings</div>
    </>
  );
};

export default Settings;
