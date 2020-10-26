import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { _t, navbarHrefLink } from "../../functions/Functions";

//context consumer
import { SettingsContext } from "../../contexts/Settings";

const Navbar = () => {
  const { t } = useTranslation();
  const { languageList } = useContext(SettingsContext);
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-2">
              <div className="fk-brand fk-brand--sr-lg">
                {/* todo:: if not authenticated link to landing page */}
                {navbarHrefLink("/dashboard")}
              </div>
            </div>
            <div className="order-2 order-lg-1 col-10 col-lg-3 col-xl-4 col-xxl-5 t-mb-15 mb-lg-0 t-mt-15 mt-lg-0">
              {window.location.pathname.includes(
                "/dashboard/manage/"
              ) ? null : (
                <div className="input-group">
                  <div className="form-file">
                    <input
                      type="text"
                      className="form-control border-0 form-control--light-1 rounded-0"
                      placeholder={_t(t("Search")) + ".."}
                    />
                  </div>
                  <button className="btn btn-primary" type="button">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              )}
            </div>
            <div className="order-1 order-lg-2 col-2 col-lg-7 col-xl-6 col-xxl-5 t-mb-15 mb-lg-0 t-mt-15 mt-lg-0">
              <div className="fk-phn-nav text-right d-lg-none">
                <span className="fk-phn-nav__icon xlg-text">
                  <i className="fa fa-bars"></i>
                </span>
              </div>
              <div className="fk-phn-nav__menu">
                <ul className="t-list config-list d-flex flex-column flex-md-row align-items-md-center flex-wrap justify-content-md-center justify-content-lg-between justify-content-xl-end">
                  <li className="config-list__item">
                    <div className="fk-language d-flex align-items-center">
                      <div className="fk-language__flag"></div>
                      <div className="dropdown">
                        <a
                          className="text-capitalize sm-text nav-link dropdown-toggle"
                          href="#"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          language
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize active"
                              href="#"
                            >
                              bangla
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              english
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              spanish
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="config-list__item">
                    <div className="d-flex align-items-center">
                      <div className="circle circle--sm rounded-circle bg-primary">
                        <span className="text-light">
                          <i className="fa fa-usd" aria-hidden="true"></i>
                        </span>
                      </div>
                      <div className="dropdown">
                        <a
                          className="text-capitalize sm-text nav-link dropdown-toggle"
                          href="#"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          USD Dollar
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              Taka
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              Yen
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              Ringit
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="config-list__item">
                    <div className="d-flex align-items-center ">
                      <div className="circle circle--sm rounded-circle avatar">
                        <img
                          src="/assets/img/user.jpg"
                          alt="foodkhan"
                          className="img-fluid avatar__img"
                        />
                      </div>
                      <div className="dropdown">
                        <a
                          className="font-weight-bold text-capitalize sm-text nav-link dropdown-toggle"
                          href="#"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          jhon doe
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              profile
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              inbox
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="#"
                            >
                              settings
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item sm-text text-capitalize"
                              href="/"
                            >
                              Homepage
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default withRouter(Navbar);
