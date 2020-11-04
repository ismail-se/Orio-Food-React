import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

//jQuery initialization
import $ from "jquery";

//functions
import { _t, managePageHrefLink } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

const ManageSidebar = () => {
  const { t } = useTranslation();
  useEffect(() => {
    handleJquery();
  }, []);

  //jQuery goes here
  const handleJquery = () => {
    var posHasSub = $(".fk-pos-nav__list-has-sub");
    var posSub = $(".fk-pos-nav__sub");
    $(".fk-pos-nav__list-has-sub > a").on("click", function (e) {
      e.preventDefault();
    });
    posHasSub.on("click", function () {
      $(this).find(posSub).slideDown();
      $(this).siblings().find(posSub).slideUp();
      $(this).addClass("active").siblings().removeClass("active");
    });
  };

  return (
    <>
      {/* Navigation for Small Screen  */}
      <div className="d-lg-none">
        <div className="row">
          <div className="col-12">
            <div className="fk-sm-nav" data-simplebar>
              <ul className="t-list fk-sm-nav__bar flex-row">
                <li className="fk-sm-nav__list active">
                  {/* todo:: menu for mobile screen */}
                  <a href="#" className="t-link fk-sm-nav__link">
                    manage page
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link">
                    manage instruction
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link">
                    manage order
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link">
                    manage something
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link">
                    manage something 2
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link">
                    manage something 3
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation for Small Screen  End*/}

      {/* Navigation for large Screen  */}
      <div className="d-none d-lg-block">
        <div className="fk-scroll--pos-menu" data-simplebar>
          <ul className="t-list fk-pos-nav">
            <li
              className={`fk-pos-nav__list fk-pos-nav__list-has-sub ${
                window.location.pathname.includes("/roles") ||
                window.location.pathname.includes("/user/")
                  ? "active"
                  : ""
              }`}
            >
              <a
                className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase rounded-0 text-left"
                rel="noopener noreferrer"
                href="#"
              >
                {_t(t("User Management"))}
              </a>
              <ul className="t-list fk-pos-nav__sub t-bg-white list-group">
                {managePageHrefLink(
                  "/dashboard/manage/user/admin-staff-user",
                  _t(t("Admin / Staff"))
                )}

                {managePageHrefLink(
                  "/dashboard/manage/user/waiter",
                  _t(t("Waiter"))
                )}

                {managePageHrefLink(
                  "/dashboard/manage/roles-and-permissions",
                  _t(t("Role Group"))
                )}
              </ul>
            </li>

            <li
              className={`fk-pos-nav__list fk-pos-nav__list-has-sub 
              ${
                window.location.pathname.includes("/restaurant") ? "active" : ""
              }`}
            >
              <a
                className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase rounded-0 text-left"
                rel="noopener noreferrer"
                href="#"
              >
                {_t(t("Restaurant"))}
              </a>
              <ul className="t-list fk-pos-nav__sub t-bg-white list-group">
                {managePageHrefLink(
                  "/dashboard/manage/restaurant/branches",
                  _t(t("Branches"))
                )}

                {managePageHrefLink(
                  "/dashboard/manage/restaurant/tables",
                  _t(t("Tables"))
                )}
              </ul>
            </li>

            <li
              className={`fk-pos-nav__list fk-pos-nav__list-has-sub ${
                window.location.pathname.includes("/languages") ||
                window.location.pathname.includes("/smtp")
                  ? "active"
                  : ""
              }`}
            >
              <a
                className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase rounded-0 text-left"
                rel="noopener noreferrer"
                href="#"
              >
                {_t(t("Settings"))}
              </a>
              <ul className="t-list fk-pos-nav__sub t-bg-white list-group">
                {managePageHrefLink(
                  "/dashboard/manage/settings/languages",
                  _t(t("Languages"))
                )}

                {managePageHrefLink(
                  "/dashboard/manage/settings/smtp-settings",
                  _t(t("Email / Smtp"))
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
      {/* Navigation for large Screen End */}
    </>
  );
};

export default ManageSidebar;
