import React, { useState, useContext, useEffect } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";

//pages, functions
import { _t, navbarHrefLink, getCookie } from "../../functions/Functions";

//context consumer
import { SettingsContext } from "../../contexts/Settings";

//3rd party packages
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  //getting context values here
  let { navLanguageList } = useContext(SettingsContext);

  // States hook  here
  const [defaultLang, setDefaultLang] = useState(null);

  useEffect(() => {
    handleOnLoadDefaultLang();
  }, [navLanguageList]);

  //set default language on site load
  const handleOnLoadDefaultLang = () => {
    let localLang = localStorage.i18nextLng;
    if (localLang) {
      if (localLang === "undefined" || localLang.includes("en-")) {
        navLanguageList &&
          navLanguageList.map((item) => {
            if (item.is_default === true) {
              i18n.changeLanguage(item.code);
              setDefaultLang(item);
            }
            return true;
          });
      } else {
        const temp =
          navLanguageList &&
          navLanguageList.find((item) => {
            return item.code === localLang;
          });
        setDefaultLang(temp);
        i18n.changeLanguage(localLang);
      }
    }
  };

  //change language to selected
  const handleDefaultLang = (lang) => {
    i18n.changeLanguage(lang.code);
    setDefaultLang(lang);
    toast.success(`${_t(t("Language has been switched!"))}`, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      className: "text-center toast-notification",
    });
  };

  return (
    <>
      {window.location.pathname !== "/login" && (
        <header id="header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-2">
                <div className="fk-brand fk-brand--sr-lg">
                  {getCookie() !== undefined
                    ? navbarHrefLink("/dashboard")
                    : navbarHrefLink("/")}
                </div>
              </div>
              <div className="order-2 order-lg-1 col-10 col-lg-3 col-xl-4 col-xxl-5 t-mb-15 mb-lg-0 t-mt-15 mt-lg-0">
                {getCookie() !== undefined
                  ? [
                      window.location.pathname.includes("/dashboard/manage/") ||
                      window.location.pathname === "/" ? null : (
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
                      ),
                    ]
                  : null}
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
                        <div
                          className="fk-language__flag"
                          style={{
                            backgroundImage: `${
                              defaultLang && `url(${defaultLang.image})`
                            }`,
                          }}
                        ></div>
                        <div className="dropdown">
                          <a
                            className="text-capitalize sm-text nav-link dropdown-toggle"
                            href="#"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            rel="noopener noreferrer"
                          >
                            {defaultLang ? defaultLang.name : "Language"}
                          </a>
                          <ul className="dropdown-menu">
                            {navLanguageList &&
                              navLanguageList.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <button
                                      type="button"
                                      className={`dropdown-item sm-text text-capitalize ${
                                        defaultLang &&
                                        item.code === defaultLang.code
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() => handleDefaultLang(item)}
                                    >
                                      {item.name}
                                    </button>
                                  </li>
                                );
                              })}
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

                    {getCookie() === undefined ? (
                      <li>
                        <NavLink
                          className="sm-text text-capitalize btn btn-primary"
                          to="/login"
                        >
                          Login
                        </NavLink>
                      </li>
                    ) : (
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

                              {window.location.pathname === "/" ? (
                                <li>
                                  <Link
                                    to="/dashboard"
                                    className="dropdown-item sm-text text-capitalize"
                                  >
                                    Dashboard
                                  </Link>
                                </li>
                              ) : (
                                <li key="homepage">
                                  <Link
                                    to="/dashboard"
                                    className="dropdown-item sm-text text-capitalize"
                                  >
                                    Dashboard
                                  </Link>
                                  <Link
                                    to="/"
                                    className="dropdown-item sm-text text-capitalize"
                                  >
                                    Homepage
                                  </Link>
                                </li>
                              )}
                              <hr className="my-1" />
                              <li>
                                <Link
                                  className="dropdown-item sm-text text-capitalize"
                                  to="#"
                                >
                                  Logout
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default withRouter(Navbar);
