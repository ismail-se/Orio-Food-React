import React, { useEffect, useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";

//jQuery initialization
import $ from "jquery";

//functions
import {
  _t,
  consolee,
  getCookie,
  modalLoading,
  footerHrefLink,
} from "../../functions/Functions";
import { useTranslation } from "react-i18next";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

//3rd party packages
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";

//context consumer
import { SettingsContext } from "../../contexts/Settings";

const cookies = new Cookies();

const Login = () => {
  const { t } = useTranslation();
  const history = useHistory();

  //getting context values here
  let { loading, setLoading } = useContext(SettingsContext);

  //state hooks here
  const [credentials, setCredentials] = useState({
    email: null,
    password: null,
    remember_me: false,
  });

  useEffect(() => {
    handleJquery();
    checkAuth();
    checkAlert();
  }, []);

  //jQuery
  const handleJquery = () => {
    //obj Image Animation
    var hoverLayer = $("body");
    var objImgOne = $(".fk-global-img__obj");

    //Animation Init
    hoverLayer.mousemove(function (e) {
      var valueX = (e.pageX * -1) / 60;
      var valueY = (e.pageY * -1) / 80;
      if (objImgOne.length) {
        objImgOne.css({
          transform: "translate3d(" + valueX + "px," + valueY + "px, 0)",
        });
      }
    });
  };

  //redirect if logged in
  const checkAuth = () => {
    console.log(getCookie());
    getCookie() !== undefined && history.replace("/dashboard");
  };

  //check alert
  const checkAlert = () => {
    if (history.location.state) {
      if (history.location.state.alert === "You need to login first!")
        toast.error(`${_t(t("You need to login first!"))}`, {
          position: "bottom-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      history.replace("/login");
    }
  };

  //set credentials here on input change
  const handleCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
      remember_me: !credentials.remember_me,
    });
  };

  //try for login, submit credentials to server
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = BASE_URL + "/auth/login";
    return axios
      .post(url, credentials)
      .then((res) => {
        let date = new Date();
        let access_token = {
          _user: res.data.access_token.slice(0, 8),
          sbb: res.data.access_token.slice(8, 10),
          frr: res.data.access_token.slice(10, 13),
          xss: res.data.access_token.slice(13),
        };

        date.setFullYear(date.getFullYear() + 1);

        cookies.set("_user", access_token._user, {
          path: "/",
          expires: date,
          sameSite: "lax",
        });

        cookies.set("sbb", access_token.sbb, {
          path: "/",
          expires: date,
          sameSite: "lax",
        });

        cookies.set("frr", access_token.frr, {
          path: "/",
          expires: date,
          sameSite: "lax",
        });

        cookies.set("xss", access_token.xss, {
          path: "/",
          expires: date,
          sameSite: "lax",
        });
        history.push("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`${_t(t("Email or password is wrong!"))}`, {
          position: "bottom-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      });
  };

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <main>
        <div className="fk-global-access">
          <div className="d-none d-lg-block">
            <div className="fk-global-img text-center">
              <img
                src="/assets/img/sign-in.png"
                alt="foodkhan"
                className="img-fluid mx-auto fk-global-img__is"
              />
              <img
                src="/assets/img/obj-1.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-1"
              />
              <img
                src="/assets/img/obj-8.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-2"
              />
              <img
                src="/assets/img/obj-7.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-6"
              />
              <img
                src="/assets/img/obj-9.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-8"
              />
            </div>
          </div>
          <div className="container my-md-auto">
            <div className="row">
              <div className="col-md-6">
                <div className="fk-brand--footer fk-brand--footer-sqr">
                  {footerHrefLink("/")}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 col-lg-6 col-xl-4 t-mt-50">
                <div className="fk-global-form">
                  {loading ? (
                    <div key="login-form">
                      <h3 className="mt-0 text-capitalize font-weight-bold">
                        signing in
                      </h3>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          {modalLoading(3)}
                          <div className="col-12">
                            <div className="d-flex align-items-center">
                              <div className="t-mr-8">
                                <button
                                  type="button"
                                  className="btn btn-primary sm-text text-uppercase"
                                >
                                  Please wait
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div key="loading">
                      <h3 className="mt-0 text-capitalize font-weight-bold">
                        sign in
                      </h3>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12 t-mb-15">
                            <input
                              onChange={handleCredentials}
                              type="email"
                              name="email"
                              placeholder="Email"
                              className="form-control border-0 rounded-1"
                            />
                          </div>
                          <div className="col-12 t-mb-15">
                            <input
                              onChange={handleCredentials}
                              name="password"
                              type="password"
                              placeholder="Password"
                              className="form-control border-0 rounded-1"
                            />
                          </div>
                          <div className="col-6 t-mb-15">
                            <label className="mx-checkbox">
                              <input
                                onChange={handleCredentials}
                                name="remember_me"
                                type="checkbox"
                                className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                              />
                              <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                                Remember Me
                              </span>
                            </label>
                          </div>
                          <div className="col-6 t-mb-15 text-right">
                            <a href="#" className="t-link sm-text">
                              Forgot password?
                            </a>
                          </div>
                          <div className="col-12">
                            <div className="d-flex align-items-center">
                              <div className="t-mr-8">
                                <button
                                  type="submit"
                                  className="btn btn-success sm-text text-uppercase"
                                >
                                  sign in
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="fk-global-footer">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-7 t-mb-15 mb-md-0">
                  <ul className="t-list d-flex flex-wrap justify-content-center justify-content-md-start">
                    <li className="t-list__item">
                      <a href="#card-2" className="t-link fk-global-link">
                        help
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-3" className="t-link fk-global-link">
                        press
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-4" className="t-link fk-global-link">
                        jobs
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-5" className="t-link fk-global-link">
                        privacy
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-6" className="t-link fk-global-link">
                        terms
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-5 text-center text-md-right">
                  <p className="xsm-text text-uppercase mb-0">
                    &copy; Food Khan | All rights reserved | 2020
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
