import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

//jQuery initialization
import $ from "jquery";

//functions
import { _t, managePageHrefLink } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

const ReportSidebar = () => {
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
            {/* Foods */}
            <li className={`fk-pos-nav__list fk-pos-nav__list-has-sub active`}>
              <a
                className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase rounded-0 text-left"
                rel="noopener noreferrer"
                href="#"
              >
                {_t(t("Sale's Reports"))}
              </a>
              <ul className="t-list fk-pos-nav__sub t-bg-white list-group">
                {/* dashboard */}
                {managePageHrefLink("/dashboard/reports", _t(t("Dashboard")))}

                {/* daily */}
                {managePageHrefLink("/dashboard/reports/daily", _t(t("Daily")))}

                {/* monthly */}
                {managePageHrefLink(
                  "/dashboard/reports/monthly",
                  _t(t("Monthly"))
                )}

                {/* yearly */}
                {managePageHrefLink(
                  "/dashboard/reports/monthly",
                  _t(t("Yearly"))
                )}

                {/* food item wise */}
                {managePageHrefLink(
                  "/dashboard/reports/food-group",
                  _t(t("Item Wise"))
                )}

                {/* food group wise */}
                {managePageHrefLink(
                  "/dashboard/reports/food-group",
                  _t(t("Group Wise"))
                )}

                {/* branch wise */}
                {managePageHrefLink(
                  "/dashboard/reports/branch",
                  _t(t("Branch Wise"))
                )}

                {/* pos user wise */}
                {managePageHrefLink(
                  "/dashboard/reports/pos-user",
                  _t(t("Pos User Wise"))
                )}

                {/* food item wise */}
                {managePageHrefLink(
                  "/dashboard/reports/dept-tag",
                  _t(t("Department Wise"))
                )}

                {/* Service charge wise */}
                {managePageHrefLink(
                  "/dashboard/reports/service-charge",
                  _t(t("Ser. Charge Wise"))
                )}

                {/* discount charge wise */}
                {managePageHrefLink(
                  "/dashboard/reports/discount",
                  _t(t("discount Wise"))
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

export default ReportSidebar;
