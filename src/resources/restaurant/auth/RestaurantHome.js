import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

//importing context consumer here
import { UserContext } from "../../../contexts/User";
import { SettingsContext } from "../../../contexts/Settings";

//functions
import { _t, restaurantMenuLink } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

const RestaurantHome = () => {
  const { t } = useTranslation();

  //getting context values here
  const { loading, setLoading } = useContext(SettingsContext);
  const { signUpInfo } = useContext(UserContext);

  //useEffect == componentDidMount()
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <>
      <Helmet>
        <title>{signUpInfo.name}</title>
      </Helmet>
      <main>
        <div class="fk-scroll--index t-mt-15 t-mb-15" data-simplebar>
          <div className="container">
            <div className="row gx-3">
              {!loading ? (
                <>
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-1.png",
                    [_t(t("Work Periods"))],
                    "fa fa-clock-o",
                    "t-text-alpha",
                    [_t(t("Time"))],
                    [_t(t("Work Periods"))],
                    "/dashboard/work-periods"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-2.png",
                    [_t(t("Point of Sale"))],
                    "fa fa-cart-plus",
                    "t-text-gamma",
                    [_t(t("Pos"))],
                    [_t(t("Point of Sale"))],
                    "/dashboard/pos"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-3.png",
                    [_t(t("Order Histories"))],
                    "fa fa-pencil",
                    "t-text-delta",
                    [_t(t("orders"))],
                    [_t(t("Order Histories"))],
                    "/dashboard/orders"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-4.png",
                    [_t(t("Customers"))],
                    "fa fa-user-circle-o",
                    "t-text-primary",
                    [_t(t("Customers"))],
                    [_t(t("Customers"))],
                    "/dashboard/customers"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-9.gif",
                    [_t(t("Kitchen"))],
                    "fa fa-coffee",
                    "t-text-epsilon",
                    [_t(t("Kitchen"))],
                    [_t(t("Kitchen"))],
                    "/dashboard/kitchen"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-5.png",
                    [_t(t("Branch"))],
                    "fa fa-home",
                    "t-text-eta",
                    [_t(t("Branch"))],
                    [_t(t("Branches"))],
                    "/dashboard/branches"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-7.png",
                    [_t(t("Reports"))],
                    "fa fa-clock-o",
                    "t-text-kappa",
                    [_t(t("Reports"))],
                    [_t(t("Reports"))],
                    "/dashboard/reports"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {restaurantMenuLink(
                    "/assets/img/product-img-8.png",
                    [_t(t("Manage"))],
                    "fa fa-clock-o",
                    "t-text-zeta",
                    [_t(t("Manage"))],
                    [_t(t("Manage"))],
                    "/dashboard/manage/settings/languages"
                  )}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {/* {restaurantMenuLink(
                "/assets/img/product-img-6.png",
                [_t(t("Logout"))],
                "fa fa-clock-o",
                "t-text-alpha",
                [_t(t("Logout"))],
                [_t(t("Logout"))],
                "/logout"
                  )}*/}
                </>
              ) : (
                <>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                  <div className="col-md-6 col-lg-4 t-mb-30">
                    <Skeleton
                      style={{ height: "250px" }}
                      className="bg-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default withRouter(RestaurantHome);
