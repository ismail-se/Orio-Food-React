import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

//importing context consumer here
import { UserContext } from "../../../contexts/User";

//functions
import { _t, restaurantMenuLink } from "../../../functions/Functions";
import { useTranslation } from "react-i18next";

const RestaurantHome = () => {
  //getting context values here
  const { signUpInfo } = useContext(UserContext);

  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{signUpInfo.name}</title>
      </Helmet>
      <main id="main" data-simplebar>
        <div className="container">
          <div className="row t-mt-70 t-mb-70">
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-1.png",
                [_t(t("Work Schedule"))],
                "fa fa-clock-o",
                "t-text-alpha",
                [_t(t("Time"))],
                [_t(t("Work Schedule"))],
                "/work"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-2.png",
                [_t(t("Point of Sale"))],
                "fa fa-cart-plus",
                "t-text-gamma",
                [_t(t("Pos"))],
                [_t(t("Point of Sale"))],
                "/pos"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-3.png",
                [_t(t("Coupon Tickets"))],
                "fa fa-money",
                "t-text-delta",
                [_t(t("time"))],
                [_t(t("Coupon Tickets"))],
                "/coupon-ticket"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-4.png",
                [_t(t("Accounts"))],
                "fa fa-user-circle-o",
                "t-text-primary",
                [_t(t("Accounts"))],
                [_t(t("Accounts"))],
                "/accounts"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-5.png",
                [_t(t("Kitchen"))],
                "fa fa-clock-o",
                "t-text-epsilon",
                [_t(t("Kitchen"))],
                [_t(t("Kitchen"))],
                "/kitchen"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-6.png",
                [_t(t("Warehouses"))],
                "fa fa-clock-o",
                "t-text-eta",
                [_t(t("Warehouses"))],
                [_t(t("Warehouses"))],
                "/warehouses"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-7.png",
                [_t(t("Reports"))],
                "fa fa-clock-o",
                "t-text-kappa",
                [_t(t("Reports"))],
                [_t(t("Reports"))],
                "/reports"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-8.png",
                [_t(t("Manage"))],
                "fa fa-clock-o",
                "t-text-zeta",
                [_t(t("Manage"))],
                [_t(t("Manage"))],
                "/manage"
              )}
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              {/* image, imgAltTxt, smallInfoIcon, infoTextColorName, infoText, title, redirectToUrl */}
              {restaurantMenuLink(
                "assets/img/product-img-9.gif",
                [_t(t("Logout"))],
                "fa fa-clock-o",
                "t-text-alpha",
                [_t(t("Logout"))],
                [_t(t("Logout"))],
                "/logout"
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default withRouter(RestaurantHome);
