import React from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { _t, footerHrefLink } from "../../functions/Functions";

const Footer = () => {
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      {window.location.pathname !== "/login" && (
        <footer id="footer" className="sicky-bottom">
          <div className="container">
            <div className="row align-items-lg-center">
              <div className="col-lg-2 t-mb-30 mb-lg-0">
                <div className="fk-brand--footer fk-brand--footer-sqr mx-auto mr-lg-auto ml-lg-0">
                  {footerHrefLink("/dashboard")}
                </div>
              </div>
              <div className="col-lg-6 col-xl-7 t-mb-30 mb-lg-0">
                <p className="mb-0 text-center sm-text">
                  &copy;
                  <a href="#" className="t-link t-link--alpha text-capitalize ">
                    Food Khan
                  </a>
                  | All rights reserved | 2020
                </p>
              </div>
              <div className="col-lg-4 col-xl-3">
                <div className="clock bg-primary">
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
