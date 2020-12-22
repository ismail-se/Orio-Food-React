import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../BaseUrl";

//functions
import { _t, getCookie, tableLoading } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Chart from "react-apexcharts";

//pages & includes
import ReportSidebar from "./ReportSidebar";

//context consumer
import { SettingsContext } from "../../../../contexts/Settings";
import { FoodContext } from "../../../../contexts/Food";

const ServiceChargeWise = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //getting context values here
  let { loading, setLoading, dataPaginating } = useContext(SettingsContext);

  let {
    setFoodForSearch,
    foodGroupForSearch,
    propertyGroupForSearch,
    variationForSearch,
  } = useContext(FoodContext);

  // States hook here
  //new item
  let [newItem, setNewItem] = useState({
    itemGroup: null,
    name: "",
    price: "",
    image: null,
    hasProperty: false,
    properties: null,
    hasVariation: false,
    variations: null,
  });

  let [priceForVariations, setPriceForVariations] = useState(null);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  //useEffect == componentDidMount()
  useEffect(() => {}, []);

  return (
    <>
      <Helmet>
        <title>{_t(t("Service Charge Wise report"))}</title>
      </Helmet>

      {/* main body */}
      <main id="main" data-simplebar>
        <div className="container">
          <div className="row t-mt-10 gx-2">
            {/* left Sidebar */}
            <div className="col-lg-3 col-xxl-2 t-mb-30 mb-lg-0">
              <ReportSidebar />
            </div>
            {/* left Sidebar ends */}

            {/* Rightbar contents */}
            <div className="col-lg-9 col-xxl-10 t-mb-30 mb-lg-0">
              <div className="t-bg-white">
                <div
                  className="fk-scroll--pos-menu table-bottom-info-hide"
                  data-simplebar
                >
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
                          <div className="col-12 t-mb-15 mb-md-0">
                            <ul className="t-list fk-breadcrumb">
                              <li className="fk-breadcrumb__list">
                                <span className="t-link fk-breadcrumb__link text-capitalize">
                                  {_t(t("Service Charge Wise report"))}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="row gx-2 justify-content-center t-pt-15 t-pb-15">
                          <div className="col-12 t-mb-15 mb-md-0 text-center mt-5">
                            <img
                              src="assets/img/coming_soon.png"
                              alt="Coming Soon"
                              className="img-fluid"
                              style={{ maxHeight: "350px", maxWidth: "600px" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Rightbar contents end*/}
          </div>
        </div>
      </main>
      {/* main body ends */}
    </>
  );
};

export default ServiceChargeWise;
