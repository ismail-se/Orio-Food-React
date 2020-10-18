import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

//importing context consumer here
import { UserContext } from "../../../contexts/User";

const RestaurantHome = () => {
  const { signUpInfo } = useContext(UserContext);
  return (
    <>
      <Helmet>
        <title>{signUpInfo.name}</title>
      </Helmet>
      <main id="main" data-simplebar>
        <div className="container">
          <div className="row t-mt-70 t-mb-70">
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-1.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-alpha text-uppercase">
                    <span className="fa fa-clock-o"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Work schedule
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-2.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-gamma text-uppercase">
                    <span className="fa fa-cart-plus"></span>
                    pos
                  </span>
                  <span className="product-card__title text-capitalize">
                    Point of Sale
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-3.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-delta text-uppercase">
                    <span className="fa fa-money"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Cupon Tickets
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-4.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-primary text-uppercase">
                    <span className="fa fa-user-circle-o"></span>
                    account
                  </span>
                  <span className="product-card__title text-capitalize">
                    Accounts
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-5.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-epsilon text-uppercase">
                    <span className="fa fa-clock-o"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Kitchen
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-6.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-zeta text-uppercase">
                    <span className="fa fa-clock-o"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Warehouses
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-7.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-eta text-uppercase">
                    <span className="fa fa-clock-o"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Reports
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-8.png"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-kappa text-uppercase">
                    <span className="fa fa-clock-o"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Manage
                  </span>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4 t-mb-30">
              <a href="#" className="t-link product-card t-bg-white">
                <div className="product-card__head">
                  <img
                    src="assets/img/product-img-9.gif"
                    alt="foodkhan"
                    className="img-fluid"
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__add">
                    <span className="product-card__add-icon">
                      <span className="las la-plus"></span>
                    </span>
                  </div>
                  <span className="product-card__sub-title t-text-alpha text-uppercase">
                    <span className="fa fa-clock-o"></span>
                    time
                  </span>
                  <span className="product-card__title text-capitalize">
                    Logout
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default withRouter(RestaurantHome);
