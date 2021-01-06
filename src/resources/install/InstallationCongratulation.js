import React, { useEffect, useContext, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";

//functions
import { _t, tableLoading } from "../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//context consumer
import { SettingsContext } from "../../contexts/Settings";

const InstallationCongratulation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //getting context values here
  let { loading, setLoading, dataPaginating } = useContext(SettingsContext);

  // States hook here

  //useEffect == componentDidMount()
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>{_t(t("Congratulations"))}</title>
      </Helmet>

      {/* main body */}
      <div id="main" className="main-height-100" data-simplebar>
        <div className="container">
          <div className="row t-mt-10 gx-2">
            {/* Rightbar contents */}
            <div className="col-10 offset-1 t-mb-30 mb-lg-0">
              <div className="t-bg-white">
                <div className="installation-full-page" data-simplebar>
                  <div className="t-pl-15 t-pr-15">
                    {/* next page data spin loading */}
                    <div className={`${dataPaginating && "loading"}`}></div>
                    {/* spin loading ends */}

                    {/* Loading effect */}
                    {loading === true ? (
                      tableLoading()
                    ) : (
                      <div key="smtp-form">
                        <div className="row gx-2 align-items-center t-pt-15 t-pb-15">
                          <div className="col-md-6 col-lg-5 t-mb-15 mb-md-0">
                            <ul className="t-list fk-breadcrumb">
                              <li className="fk-breadcrumb__list"></li>
                            </ul>
                          </div>
                          <div className="col-md-6 col-lg-7">
                            <div className="row gx-3 align-items-center"></div>
                          </div>
                        </div>

                        {/* Form starts here */}
                        <div className="text-center">
                          <h3 className="text-success font-weight-bold text-uppercase text-decoration-underline">
                            Congratulations!
                          </h3>
                        </div>

                        <div className="text-center pt-5">
                          <p className="pt-5">
                            You have successfully completed the installation
                            process
                          </p>
                          <p className="text-uppercase">
                            Do not forget to give us a positive rating
                          </p>
                          <div className="text-center">
                            {/* live server */}
                            {/* <NavLink
                              to="/"
                              className="btn btn-primary px-4 mt-2 mb-3 text-uppercase"
                            >
                              Start using
                            </NavLink> */}
                            {/* <a
                              href="/khadyo"
                              className="btn btn-primary px-4 mt-2 mb-3 text-uppercase"
                              rel="noopener noreferrer"
                            >
                              Start using
                            </a> */}
                            <a
                              href="/"
                              className="btn btn-primary px-4 mt-2 mb-3 text-uppercase"
                              rel="noopener noreferrer"
                            >
                              Start using
                            </a>
                          </div>
                        </div>

                        {/* Form ends here */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Rightbar contents end*/}
          </div>
        </div>
      </div>
      {/* main body ends */}
    </>
  );
};

export default InstallationCongratulation;
