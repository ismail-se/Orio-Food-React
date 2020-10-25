import React, { useEffect } from "react";
import $ from "jquery";
//functions
import { _t } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

const ManageSidebar = () => {
  const { t } = useTranslation();
  useEffect(() => {
    handleJquery();
  }, []);

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
              <ul className="t-list fk-sm-nav__bar list-group flex-row">
                <li className="fk-sm-nav__list active">
                  <a
                    href="#nav-1"
                    className="t-link fk-sm-nav__link"
                    data-toggle="list"
                  >
                    manage page
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a
                    href="#nav-2"
                    className="t-link fk-sm-nav__link"
                    data-toggle="list"
                  >
                    manage instruction
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a
                    href="#nav-3"
                    className="t-link fk-sm-nav__link"
                    data-toggle="list"
                  >
                    manage order
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a
                    href="#nav-4"
                    className="t-link fk-sm-nav__link"
                    data-toggle="list"
                  >
                    manage something
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a
                    href="#nav-5"
                    className="t-link fk-sm-nav__link"
                    data-toggle="list"
                  >
                    manage something 2
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a
                    href="#nav-6"
                    className="t-link fk-sm-nav__link"
                    data-toggle="list"
                  >
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
            <li className="fk-pos-nav__list fk-pos-nav__list-has-sub active">
              <a
                className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase rounded-0 text-left"
                href="#"
              >
                Settings
              </a>
              <ul className="t-list fk-pos-nav__sub t-bg-white list-group">
                <li className="fk-pos-nav__sub-list border-bottom">
                  <a
                    className="w-100 t-text-dark t-heading-font btn font-weight-bold text-uppercase rounded-0 text-left active"
                    href="#nav-1"
                    data-toggle="list"
                  >
                    <i className="fa fa-arrow-right"></i> Languages
                  </a>
                </li>
                <li className="fk-pos-nav__sub-list border-bottom">
                  <a
                    className="w-100 t-text-dark t-heading-font btn font-weight-bold text-uppercase rounded-0 text-left"
                    href="#nav-2"
                    data-toggle="list"
                  >
                    <i className="fa fa-arrow-right"></i> instruction
                  </a>
                </li>
                <li className="fk-pos-nav__sub-list border-bottom">
                  <a
                    className="w-100 t-text-dark t-heading-font btn font-weight-bold text-uppercase rounded-0 text-left"
                    href="#nav-3"
                    data-toggle="list"
                  >
                    <i className="fa fa-arrow-right"></i> manage order
                  </a>
                </li>
              </ul>
            </li>
            <li className="fk-pos-nav__list fk-pos-nav__list-has-sub">
              <a
                className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase rounded-0 text-left"
                href="#"
              >
                menu 02
              </a>
              <ul className="t-list fk-pos-nav__sub t-bg-white list-group">
                <li className="fk-pos-nav__sub-list border-bottom">
                  <a
                    className="w-100 t-text-dark t-heading-font btn font-weight-bold text-uppercase rounded-0 text-left"
                    href="#nav-4"
                    data-toggle="list"
                  >
                    manage page
                  </a>
                </li>
                <li className="fk-pos-nav__sub-list border-bottom">
                  <a
                    className="w-100 t-text-dark t-heading-font btn font-weight-bold text-uppercase rounded-0 text-left"
                    href="#nav-5"
                    data-toggle="list"
                  >
                    instruction
                  </a>
                </li>
                <li className="fk-pos-nav__sub-list border-bottom">
                  <a
                    className="w-100 t-text-dark t-heading-font btn font-weight-bold text-uppercase rounded-0 text-left"
                    href="#nav-6"
                    data-toggle="list"
                  >
                    manage order
                  </a>
                </li>
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
