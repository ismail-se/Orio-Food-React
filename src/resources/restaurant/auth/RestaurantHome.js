import React, { useEffect, useContext, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

//importing context consumer here
import { UserContext } from "../../../contexts/User";
import { SettingsContext } from "../../../contexts/Settings";

//functions
import {
  _t,
  restaurantMenuLink,
  deleteCookie,
} from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import Skeleton from "react-loading-skeleton";

const RestaurantHome = () => {
  const { t } = useTranslation();
  const history = useHistory();

  //getting context values here
  let {
    //common
    loading,
    setLoading,
  } = useContext(SettingsContext);
  const { authUserInfo } = useContext(UserContext);

  //useEffect == componentDidMount()
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  //logout
  const handleLogout = () => {
    deleteCookie();
    history.push({ pathname: "/login", state: "loggedOut" });
  };
  return (
    <>
      <Helmet>
        <title>
          {authUserInfo.details !== null && authUserInfo.details.name}
        </title>
      </Helmet>
      <main>
        <div className="fk-scroll--index t-mt-15 t-mb-15" data-simplebar>
          <div className="container">
            <div className="row gx-3">
              {!loading ? (
                <>
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Work period")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-1.jpg",
                        [_t(t("Work Periods"))],
                        "fa fa-clock-o",
                        "t-text-alpha",
                        [_t(t("Time"))],
                        [_t(t("Work Periods"))],
                        "/dashboard/work-periods"
                      )
                    : null}

                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("POS")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-2.jpg",
                        [_t(t("Point of Sale"))],
                        "fa fa-cart-plus",
                        "t-text-gamma",
                        [_t(t("Pos"))],
                        [_t(t("Point of Sale"))],
                        "/dashboard/pos"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Order history")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-3.jpg",
                        [_t(t("Order Histories"))],
                        "fa fa-pencil",
                        "t-text-delta",
                        [_t(t("Orders"))],
                        [_t(t("Order Histories"))],
                        "/dashboard/orders"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Customer")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-4.jpg",
                        [_t(t("Customers"))],
                        "fa fa-user-circle-o",
                        "t-text-primary",
                        [_t(t("Customers"))],
                        [_t(t("Customers"))],
                        "/dashboard/customers"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Kitchen")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-9.jpg",
                        [_t(t("Kitchen"))],
                        "fa fa-coffee",
                        "t-text-epsilon",
                        [_t(t("Kitchen"))],
                        [_t(t("Kitchen"))],
                        "/dashboard/kitchen"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Report")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-7.png",
                        [_t(t("Reports"))],
                        "fa fa-clock-o",
                        "t-text-kappa",
                        [_t(t("Reports"))],
                        [_t(t("Reports"))],
                        "/dashboard/reports"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Manage")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-8.png",
                        [_t(t("Manage"))],
                        "fa fa-clock-o",
                        "t-text-zeta",
                        [_t(t("Manage"))],
                        [_t(t("Manage"))],
                        "/dashboard/manage/food/add-new"
                      )
                    : null}

                  <div className="col-md-6 col-lg-4 t-mb-15">
                    <button
                      onClick={handleLogout}
                      className="t-link product-card t-bg-white pb-2 border-0 text-left"
                    >
                      <div className="product-card__head">
                        <img
                          src="/assets/img/product-img-6.png"
                          alt={_t(t("Logout"))}
                          className="img-fluid"
                        />
                      </div>
                      <div className="product-card__body">
                        <div className="product-card__add">
                          <span className="product-card__add-icon">
                            <span className="las la-plus"></span>
                          </span>
                        </div>
                        <span
                          className={`product-card__sub-title t-text-alpha text-uppercase`}
                        >
                          <span className="fa fa-clock-o"></span>{" "}
                          {_t(t("Logout"))}
                        </span>
                        <span className="product-card__title text-capitalize">
                          {_t(t("Logout"))}
                        </span>
                      </div>
                    </button>
                  </div>
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
