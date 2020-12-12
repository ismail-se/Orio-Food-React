import React, { useState, useContext, useEffect } from "react";
import { NavLink, Link, withRouter, useHistory } from "react-router-dom";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

//pages, functions
import {
  _t,
  getCookie,
  deleteCookie,
  getSystemSettings,
  modalLoading,
} from "../../functions/Functions";

//context consumer
import { SettingsContext } from "../../contexts/Settings";
import { UserContext } from "../../contexts/User";
import { FoodContext } from "../../contexts/Food";

//3rd party packages
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = (props) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  //getting context values here
  let { navLanguageList, navCurrencyList, generalSettings } = useContext(
    SettingsContext
  );
  let { authUserInfo } = useContext(UserContext);
  let { setLoading } = useContext(FoodContext);

  // States hook  here
  const [defaultLang, setDefaultLang] = useState(null);
  const [defaultCurrency, setDefaultCurrency] = useState(null);

  //new adminStaff
  let [newAdminStaff, setAdminStaff] = useState({
    phn_no: "",
    password: "",
    password_confirmation: "",
    image: null,
    edit: false,
    uploading: false,
  });

  useEffect(() => {
    handleOnLoadDefaultLang();
    handleOnLoadDefaultCurrency();
  }, [navLanguageList, navCurrencyList]);

  //set default language on site load
  const handleOnLoadDefaultLang = () => {
    let localLang = localStorage.i18nextLng;
    if (localLang) {
      if (localLang === undefined || localLang.includes("en-")) {
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

  //set default currency on site load
  const handleOnLoadDefaultCurrency = () => {
    let localCurrency = JSON.parse(localStorage.getItem("currency"));
    if (localCurrency === null) {
      navCurrencyList &&
        navCurrencyList.map((item) => {
          if (item.is_default === true) {
            setDefaultCurrency(item);
            localStorage.setItem("currency", JSON.stringify(item));
          }
          return true;
        });
    } else {
      const temp =
        navCurrencyList &&
        navCurrencyList.find((item) => {
          return item.code === localCurrency.code;
        });
      setDefaultCurrency(temp);
    }
  };

  //change currency to selected
  const handleDefaultCurrency = (item) => {
    setLoading(true);
    localStorage.setItem("currency", JSON.stringify(item));
    setDefaultCurrency(item);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    toast.success(`${_t(t("Currency has been changed!"))}`, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      className: "text-center toast-notification",
    });
  };

  //logout
  const handleLogout = () => {
    deleteCookie();
    history.push({ pathname: "/login", state: "loggedOut" });
  };

  //set image hook
  const handleAdminStaffImage = (e) => {
    setAdminStaff({
      ...newAdminStaff,
      [e.target.name]: e.target.files[0],
    });
  };

  //set name, phn no hook
  const handleSetNewAdminStaff = (e) => {
    setAdminStaff({ ...newAdminStaff, [e.target.name]: e.target.value });
  };

  //set name, phn no hook
  const handleUpdateAdminStaff = (e) => {
    e.preventDefault();
    const adminStaffUrl = BASE_URL + `/settings/update-profile`;
    setAdminStaff({
      ...newAdminStaff,
      uploading: true,
    });

    let formData = new FormData();
    formData.append("phn_no", newAdminStaff.phn_no);
    formData.append("password", newAdminStaff.password);
    formData.append(
      "password_confirmation",
      newAdminStaff.password_confirmation
    );
    formData.append("image", newAdminStaff.image);

    return axios
      .post(adminStaffUrl, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        console.log(res.data);
        setAdminStaff({
          ...newAdminStaff,
          uploading: false,
        });
        // handleLogout();

        //close the modal of update user pw
        // let theBody = document.getElementById("modalClose");
        // theBody.removeAttribute("class");
        // let theModal = document.getElementById("updateProfile");
        // theModal.removeAttribute("aria-modal");
        // theModal.removeAttribute("role");
        // theModal.setAttribute("style", "display: none;");
        // theModal.setAttribute("area-hidden", "true");
        // let theFade = document.getElementsByClassName("modal-backdrop")[0];
        // theFade.removeAttribute("class");

        toast.success(`${_t(t("Profile updated, please login to continue"))}`, {
          position: "bottom-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setAdminStaff({
          ...newAdminStaff,
          uploading: false,
        });
        // if (error && error.response.data.errors) {
        //   if (error.response.data.errors.phn_no) {
        //     error.response.data.errors.phn_no.forEach((item) => {
        //       if (item === "An user exists with this phone number") {
        //         toast.error(
        //           `${_t(t("An user exists with this phone number"))}`,
        //           {
        //             position: "bottom-center",
        //             autoClose: 10000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             className: "text-center toast-notification",
        //           }
        //         );
        //       }
        //     });
        //   }

        //   if (error.response.data.errors.password) {
        //     error.response.data.errors.password.forEach((item) => {
        //       if (item === "Password confirmation does not match") {
        //         toast.error(
        //           `${_t(t("Password confirmation does not match"))}`,
        //           {
        //             position: "bottom-center",
        //             autoClose: 10000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             className: "text-center toast-notification",
        //           }
        //         );
        //       }
        //     });
        //   }
        //   if (error.response.data.errors.image) {
        //     error.response.data.errors.image.forEach((item) => {
        //       if (item === "Please select a valid image file") {
        //         toast.error(`${_t(t("Please select a valid image file"))}`, {
        //           position: "bottom-center",
        //           autoClose: 10000,
        //           hideProgressBar: false,
        //           closeOnClick: true,
        //           pauseOnHover: true,
        //           className: "text-center toast-notification",
        //         });
        //       }
        //       if (item === "Please select a file less than 5MB") {
        //         toast.error(`${_t(t("Please select a file less than 5MB"))}`, {
        //           position: "bottom-center",
        //           autoClose: 10000,
        //           hideProgressBar: false,
        //           closeOnClick: true,
        //           pauseOnHover: true,
        //           className: "text-center toast-notification",
        //         });
        //       }
        //     });
        //   }
        // }
      });
  };

  //dynamic style
  const style = {
    logo: {
      backgroundColor:
        generalSettings &&
        getSystemSettings(generalSettings, "type_background"),
      backgroundImage:
        generalSettings &&
        `url(${getSystemSettings(generalSettings, "type_logo")})`,
    },
    currency: {
      backgroundColor:
        generalSettings &&
        getSystemSettings(generalSettings, "type_background"),
      color:
        generalSettings && getSystemSettings(generalSettings, "type_color"),
    },
  };
  return (
    <>
      {/* modal */}
      <div className="modal fade" id="updateProfile" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  {_t(t("Update profile"))}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* show form or show saving loading */}
              {newAdminStaff.uploading === false ? (
                <div key="fragment-permission-1">
                  <form onSubmit={handleUpdateAdminStaff}>
                    <div className="mt-3">
                      <label htmlFor="phn_no" className="form-label">
                        {_t(t("Phone number"))}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="phn_no"
                        name="phn_no"
                        placeholder="e.g. 01xxx xxx xxx"
                        value={newAdminStaff.phn_no || ""}
                        onChange={handleSetNewAdminStaff}
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-3">
                      <label htmlFor="password" className="form-label">
                        {_t(t("Password"))}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="e.g. Password"
                        value={newAdminStaff.password || ""}
                        onChange={handleSetNewAdminStaff}
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-3">
                      <label
                        htmlFor="password_confirmation"
                        className="form-label"
                      >
                        {_t(t("Confirm Password"))}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="e.g. Confirm password"
                        value={newAdminStaff.password_confirmation || ""}
                        required={newAdminStaff.password !== ""}
                        onChange={handleSetNewAdminStaff}
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-3">
                      <div className="d-flex align-items-center mb-1">
                        <label htmlFor="image" className="form-label mb-0 mr-3">
                          {_t(t("Image"))}{" "}
                          <small className="text-secondary">
                            ({_t(t("Square Image Preferable"))})
                          </small>
                        </label>
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={handleAdminStaffImage}
                      />
                    </div>

                    <div className="mt-4">
                      <div className="row">
                        <div className="col-6">
                          <button
                            type="submit"
                            className="btn btn-success w-100 xsm-text text-uppercase t-width-max"
                          >
                            {_t(t("Update"))}
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            type="button"
                            className="btn btn-primary w-100 xsm-text text-uppercase t-width-max"
                            data-dismiss="modal"
                          >
                            {_t(t("Close"))}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div key="fragment2">
                  <div className="text-center text-primary font-weight-bold text-uppercase">
                    {_t(t("Please wait"))}
                  </div>
                  {modalLoading(3)}
                  <div className="mt-4">
                    <div className="row">
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-success w-100 xsm-text text-uppercase t-width-max"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          data-dismiss="modal"
                        >
                          {_t(t("Update"))}
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-primary w-100 xsm-text text-uppercase t-width-max"
                          data-dismiss="modal"
                        >
                          {_t(t("Close"))}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal Ends*/}

      {props.location.pathname !== "/login" &&
      props.location.pathname !== "/login/" &&
      props.location.pathname !== "/dashboard/pos" &&
      props.location.pathname !== "/dashboard/pos/" &&
      props.location.pathname !== "/reset-password" &&
      props.location.pathname !== "/reset-password/" &&
      !props.location.pathname.includes("/set-new-password") ? (
        <header id="header" className="sticky-top">
          <div
            className={`${
              props.location.pathname.includes("/dashboard/kitchen") ||
              props.location.pathname.includes("/dashboard/orders")
                ? "container-fluid"
                : "container"
            }`}
          >
            <div className="row align-items-center">
              <div className="col-6 col-lg-2">
                <div className="fk-brand fk-brand--sr-lg">
                  {getCookie() !== undefined
                    ? [
                        window.location.pathname === "/dashboard" ? (
                          <NavLink
                            to={{ pathname: "/refresh", state: "/dashboard" }}
                            exact
                            className="t-link w-100"
                            key="logokey"
                          >
                            <span
                              className="fk-brand__img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ) : (
                          <NavLink
                            to="/dashboard"
                            exact
                            className="t-link w-100"
                            key="logokey"
                          >
                            <span
                              className="fk-brand__img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ),
                      ]
                    : [
                        window.location.pathname === "/" ? (
                          <NavLink
                            to={{ pathname: "/refresh", state: "/" }}
                            exact
                            className="t-link w-100"
                          >
                            <span
                              className="fk-brand__img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ) : (
                          <NavLink to="/" exact className="t-link w-100">
                            <span
                              className="fk-brand__img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ),
                      ]}
                </div>
              </div>

              <div className="col-6 col-lg-7 col-xl-6 col-xxl-5 ml-lg-auto">
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
                            className="text-capitalize sm-text nav-link dropdown-toggle pl-2"
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
                        <div
                          className="circle circle--sm rounded-circle border"
                          style={style.currency}
                        >
                          {defaultCurrency ? defaultCurrency.symbol : "$"}
                        </div>
                        <div className="dropdown">
                          <a
                            className="sm-text nav-link dropdown-toggle pl-2"
                            href="#"
                            data-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {defaultCurrency
                              ? defaultCurrency.code
                              : "Currency"}
                          </a>
                          <ul className="dropdown-menu">
                            {navCurrencyList &&
                              navCurrencyList.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <button
                                      type="button"
                                      className={`dropdown-item sm-text text-capitalize ${
                                        defaultCurrency &&
                                        item.code === defaultCurrency.code
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleDefaultCurrency(item)
                                      }
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
                    {getCookie() === undefined ||
                    (props.location.state &&
                      props.location.state === "loggedOut") ? (
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
                              src={
                                authUserInfo.details !== null &&
                                authUserInfo.details.image !== null
                                  ? [
                                      BASE_URL +
                                        "/public/" +
                                        authUserInfo.details.image,
                                    ]
                                  : "/assets/img/user.jpg"
                              }
                              alt="foodkhan"
                              className="img-fluid avatar__img"
                            />
                          </div>
                          <div className="dropdown">
                            <a
                              className="font-weight-bold text-capitalize sm-text nav-link dropdown-toggle pl-2"
                              href="#"
                              data-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {authUserInfo.details !== null &&
                                authUserInfo.details.name}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-right">
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
                                </li>
                              )}
                              <li>
                                <button
                                  className="dropdown-item sm-text text-capitalize"
                                  data-toggle="modal"
                                  data-target="#updateProfile"
                                >
                                  Update Profile
                                </button>
                              </li>
                              <hr className="my-1" />
                              <li>
                                <button
                                  className="dropdown-item sm-text text-capitalize"
                                  onClick={handleLogout}
                                >
                                  Logout
                                </button>
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
      ) : (
        [
          props.location.pathname === "/dashboard/pos" && (
            <header id="header" className="sticky-top">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-6 col-lg-2">
                    <div className="fk-brand fk-brand--sr-lg">
                      {getCookie() !== undefined
                        ? [
                            window.location.pathname === "/dashboard" ? (
                              <NavLink
                                to={{
                                  pathname: "/refresh",
                                  state: "/dashboard",
                                }}
                                exact
                                className="t-link w-100"
                              >
                                <span
                                  className="fk-brand__img fk-brand__img--fk"
                                  style={style.logo}
                                ></span>
                              </NavLink>
                            ) : (
                              <NavLink
                                to="/dashboard"
                                exact
                                className="t-link w-100"
                                key="logokey"
                              >
                                <span
                                  className="fk-brand__img fk-brand__img--fk"
                                  style={style.logo}
                                ></span>
                              </NavLink>
                            ),
                          ]
                        : [
                            window.location.pathname === "/" ? (
                              <NavLink
                                to={{ pathname: "/refresh", state: "/" }}
                                exact
                                className="t-link w-100"
                              >
                                <span
                                  className="fk-brand__img fk-brand__img--fk"
                                  style={style.logo}
                                ></span>
                              </NavLink>
                            ) : (
                              <NavLink to="/" exact className="t-link w-100">
                                <span
                                  className="fk-brand__img fk-brand__img--fk"
                                  style={style.logo}
                                ></span>
                              </NavLink>
                            ),
                          ]}
                    </div>
                  </div>

                  <div className="col-6 col-lg-7 col-xl-6 col-xxl-5 ml-lg-auto">
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
                                className="text-capitalize sm-text nav-link dropdown-toggle pl-2"
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
                                          onClick={() =>
                                            handleDefaultLang(item)
                                          }
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
                            <div
                              className="circle circle--sm rounded-circle border"
                              style={style.currency}
                            >
                              {defaultCurrency ? defaultCurrency.symbol : "$"}
                            </div>
                            <div className="dropdown">
                              <a
                                className="sm-text nav-link dropdown-toggle pl-2"
                                href="#"
                                data-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {defaultCurrency
                                  ? defaultCurrency.code
                                  : "Currency"}
                              </a>
                              <ul className="dropdown-menu">
                                {navCurrencyList &&
                                  navCurrencyList.map((item, index) => {
                                    return (
                                      <li key={index}>
                                        <button
                                          type="button"
                                          className={`dropdown-item sm-text text-capitalize ${
                                            defaultCurrency &&
                                            item.code === defaultCurrency.code
                                              ? "active"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleDefaultCurrency(item)
                                          }
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
                        {getCookie() === undefined ||
                        (props.location.state &&
                          props.location.state === "loggedOut") ? (
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
                                  src={
                                    authUserInfo.details !== null &&
                                    authUserInfo.details.image !== null
                                      ? [
                                          BASE_URL +
                                            "/public/" +
                                            authUserInfo.details.image,
                                        ]
                                      : "/assets/img/user.jpg"
                                  }
                                  alt="foodkhan"
                                  className="img-fluid avatar__img"
                                />
                              </div>
                              <div className="dropdown">
                                <a
                                  className="font-weight-bold text-capitalize sm-text nav-link dropdown-toggle pl-2"
                                  href="#"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  {authUserInfo.details !== null &&
                                    authUserInfo.details.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-right">
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
                                    </li>
                                  )}
                                  <li>
                                    <button
                                      className="dropdown-item sm-text text-capitalize"
                                      data-toggle="modal"
                                      data-target="#updateProfile"
                                    >
                                      Update Profile
                                    </button>
                                  </li>
                                  <hr className="my-1" />
                                  <li>
                                    <button
                                      className="dropdown-item sm-text text-capitalize"
                                      onClick={handleLogout}
                                      rel="noopener noreferrer"
                                    >
                                      Logout
                                    </button>
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
                <div className="d-md-none">
                  <div className="row">
                    <div className="col-12">
                      <div className="fk-sm-nav" data-simplebar>
                        <ul className="t-list fk-sm-nav__bar">
                          <li className="fk-sm-nav__list active">
                            <a
                              href="#card-1"
                              className="t-link fk-sm-nav__link"
                            >
                              chicken burger
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-2"
                              className="t-link fk-sm-nav__link"
                            >
                              beef burger
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-3"
                              className="t-link fk-sm-nav__link"
                            >
                              Gourmet burger
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-4"
                              className="t-link fk-sm-nav__link"
                            >
                              pizza
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-5"
                              className="t-link fk-sm-nav__link"
                            >
                              pasta
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-6"
                              className="t-link fk-sm-nav__link"
                            >
                              soup
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-7"
                              className="t-link fk-sm-nav__link"
                            >
                              fired rice
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-8"
                              className="t-link fk-sm-nav__link"
                            >
                              snacks
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-9"
                              className="t-link fk-sm-nav__link"
                            >
                              drinks
                            </a>
                          </li>
                          <li className="fk-sm-nav__list">
                            <a
                              href="#card-10"
                              className="t-link fk-sm-nav__link"
                            >
                              Sandwich
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          ),
        ]
      )}
    </>
  );
};

export default withRouter(Navbar);
