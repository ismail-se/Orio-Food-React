import React, { useContext } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { _t, getCookie, getSystemSettings } from "../../functions/Functions";

//context consumer
import { SettingsContext } from "../../contexts/Settings";

const Footer = () => {
  //getting context values here
  let { generalSettings } = useContext(SettingsContext);
  var weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const style = {
    logo: {
      backgroundColor:
        generalSettings &&
        getSystemSettings(generalSettings, "type_background"),
      backgroundImage:
        generalSettings &&
        `url(${getSystemSettings(generalSettings, "type_logo")})`,
    },
    clock: {
      backgroundColor:
        generalSettings &&
        getSystemSettings(generalSettings, "type_background"),
    },
  };

  return (
    <>
      {window.location.pathname !== "/login" && (
        <footer id="footer" className="sicky-bottom">
          <div className="container">
            <div className="row align-items-lg-center">
              <div className="col-lg-2 t-mb-30 mb-lg-0">
                <div className="fk-brand--footer fk-brand--footer-sqr mx-auto mr-lg-auto ml-lg-0">
                  {getCookie() !== undefined
                    ? [
                        window.location.pathname === "/dashboard" ? (
                          <NavLink
                            to={{ pathname: "/refresh", state: "/dashboard" }}
                            exact
                            className="t-link w-100 t-h-50"
                          >
                            {/* todo:: background image dynamic */}
                            <span
                              className="fk-brand--footer-img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ) : (
                          <NavLink
                            to="/dashboard"
                            className="t-link w-100 t-h-50"
                          >
                            {/* todo:: background image dynamic */}
                            <span
                              className="fk-brand--footer-img fk-brand__img--fk"
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
                            className="t-link w-100 t-h-50"
                          >
                            <span
                              className="fk-brand--footer-img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ) : (
                          <NavLink to="/" className="t-link w-100 t-h-50">
                            <span
                              className="fk-brand--footer-img fk-brand__img--fk"
                              style={style.logo}
                            ></span>
                          </NavLink>
                        ),
                      ]}
                </div>
              </div>
              <div className="col-lg-6 col-xl-7 t-mb-30 mb-lg-0">
                <p className="mb-0 text-center sm-text">
                  &copy;
                  {generalSettings &&
                    getSystemSettings(generalSettings, "type_footer")}
                </p>
              </div>
              <div className="col-lg-4 col-xl-3">
                <div className="clock" style={style.clock}>
                  <div className="clock__icon t-mr-30">
                    <span className="fa fa-clock-o"></span>
                  </div>
                  <div className="clock__content">
                    <div
                      id="MyClockDisplay"
                      className="clockDisply"
                      onLoad={() => {
                        "showTime()";
                      }}
                    ></div>
                    <p className="mb-0 font-10px font-weight-normal">
                      {weekday[new Date().getDay()]}, {new Date().getDate()}{" "}
                      {month[new Date().getMonth()]}, {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default withRouter(Footer);
