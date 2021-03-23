import React, { useEffect, useContext, useState } from "react";
import { NavLink, withRouter, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

//importing context consumer here
import { UserContext } from "../../../contexts/User";
import { SettingsContext } from "../../../contexts/Settings";

//functions
import {
  _t,
  restaurantMenuLink,
  deleteCookie,
  getSystemSettings,
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
    generalSettings,
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
  };
  return (
    <>
      <Helmet>
        <title>
          Orio Food
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
                        "/assets/icons/time.svg",
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
                        "/assets/icons/pos.svg",
                        "t-text-alpha",
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
                        "/assets/icons/orders.svg",
                        "t-text-alpha",
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
                        "/assets/icons/customers.svg",
                        "t-text-alpha",
                        [_t(t("Customers"))],
                        [_t(t("Customers"))],
                        "/dashboard/customers"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Kitchen")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-5.jpg",
                        [_t(t("Kitchen"))],
                        "/assets/icons/kitchen.svg",
                        "t-text-alpha",
                        [_t(t("Kitchen"))],
                        [_t(t("Kitchen"))],
                        "/dashboard/kitchen"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Report")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-6.jpg",
                        [_t(t("Reports"))],
                        "/assets/icons/reports.svg",
                        "t-text-alpha",
                        [_t(t("Reports"))],
                        [_t(t("Reports"))],
                        "/dashboard/reports"
                      )
                    : null}
                  {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
                  {authUserInfo.permissions !== null &&
                  authUserInfo.permissions.includes("Manage")
                    ? restaurantMenuLink(
                        "/assets/img/product-img-7.jpg",
                        [_t(t("Manage"))],
                        "/assets/icons/manage.svg",
                        "t-text-alpha",
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
                          src="/assets/img/product-img-8.jpg"
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
                          <img src="/assets/icons/logout.svg" alt=""/>{" "}
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
