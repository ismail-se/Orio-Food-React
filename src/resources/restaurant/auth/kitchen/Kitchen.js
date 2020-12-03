import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
//jQuery initialization
import $ from "jquery";

//functions
import { _t } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

// 3rd party packages
import Filterizr from "filterizr";

Filterizr.installAsJQueryPlugin($);
const Kitchen = () => {
  const { t } = useTranslation();
  useEffect(() => {
    handleJquery();
  }, []);

  //jQuery
  const handleJquery = () => {
    var filterizd = $(".filtr-container");
    if (filterizd.length) {
      filterizd.filterizr({
        layout: "sameWidth",
        gutterPixels: 40,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{_t(t("Kitchen"))}</title>
      </Helmet>
      <main id="main" data-simplebar>
        <div className="fk-scroll--index t-mt-15 t-mb-15" data-simplebar>
          <div className="container-fluid">
            <div className="t-bg-white t-pt-10 t-pb-10 t-pl-15 t-pr-15">
              <div className="row gx-2 align-items-center">
                <div className="col-md-6 t-mb-15 mb-md-0">
                  <ul className="t-list fk-breadcrumb">
                    <li className="fk-breadcrumb__list">
                      <a
                        href="#"
                        className="t-link fk-breadcrumb__link text-capitalize"
                      >
                        kitchen
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <div className="form-file">
                      <input
                        type="text"
                        className="form-control border-0 form-control--light-1 rounded-0"
                        placeholder="Please Search "
                      />
                    </div>
                    <button className="btn btn-primary" type="button">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters g-0 filtr-container">
              <div className="col-md-6 col-xl-4 filtr-item" data-category="1">
                <div className="fk-order-token t-bg-white p-3">
                  <div className="fk-order-token__body">
                    <div className="fk-addons-table">
                      <div className="fk-addons-table__head text-center">
                        order token: 01
                      </div>
                      <div className="fk-addons-table__info">
                        <div className="row g-0">
                          <div className="col-2 text-center border-right">
                            <span className="fk-addons-table__info-text text-capitalize">
                              S/L
                            </span>
                          </div>
                          <div className="col-3 text-center border-right">
                            <span className="fk-addons-table__info-text text-capitalize">
                              food
                            </span>
                          </div>
                          <div className="col-4 text-center border-right">
                            <span className="fk-addons-table__info-text text-capitalize">
                              addons
                            </span>
                          </div>
                          <div className="col-2 text-center border-right">
                            <span className="fk-addons-table__info-text text-capitalize">
                              QT
                            </span>
                          </div>
                          <div className="col-1 text-center">
                            <span className="fk-addons-table__info-text text-capitalize">
                              <i className="fa fa-check"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="fk-addons-table__body">
                        <div className="fk-addons-table__body-row">
                          <div className="row g-0">
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                1
                              </span>
                            </div>
                            <div className="col-3 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                chicken burger
                              </span>
                            </div>
                            <div className="col-4 text-center border-right t-pl-10 t-pr-10">
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                <span className="font-weight-bold">
                                  addons:
                                </span>
                                cheese, naga
                              </span>
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                <span className="font-weight-bold">
                                  variation:
                                </span>
                                cheese, naga
                              </span>
                            </div>
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                5
                              </span>
                            </div>
                            <div className="col-1 text-center d-flex">
                              <label className="mx-checkbox mx-checkbox--empty m-auto">
                                <input
                                  type="checkbox"
                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                />
                                <span className="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="fk-addons-table__body-row">
                          <div className="row g-0">
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                2
                              </span>
                            </div>
                            <div className="col-3 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                burger
                              </span>
                            </div>
                            <div className="col-4 text-center border-right t-pl-10 t-pr-10">
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                <span className="font-weight-bold">
                                  addons:
                                </span>
                                cheese, naga
                              </span>
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                <span className="font-weight-bold">
                                  variation:
                                </span>
                                cheese, naga
                              </span>
                            </div>
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                5
                              </span>
                            </div>
                            <div className="col-1 text-center d-flex">
                              <label className="mx-checkbox mx-checkbox--empty m-auto">
                                <input
                                  type="checkbox"
                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                />
                                <span className="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="fk-addons-table__body-row">
                          <div className="row g-0">
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                3
                              </span>
                            </div>
                            <div className="col-3 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                coleslaw
                              </span>
                            </div>
                            <div className="col-4 text-center border-right t-pl-10 t-pr-10">
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                <span className="font-weight-bold">
                                  addons:
                                </span>
                                cheese, naga
                              </span>
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                <span className="font-weight-bold">
                                  variation:
                                </span>
                                cheese, naga
                              </span>
                            </div>
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                4
                              </span>
                            </div>
                            <div className="col-1 text-center d-flex">
                              <label className="mx-checkbox mx-checkbox--empty m-auto">
                                <input
                                  type="checkbox"
                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                />
                                <span className="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="fk-addons-table__body-row">
                          <div className="row g-0">
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                4
                              </span>
                            </div>
                            <div className="col-3 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                fried chicken
                              </span>
                            </div>
                            <div className="col-4 text-center border-right t-pl-10 t-pr-10">
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                <span className="font-weight-bold">
                                  addons:
                                </span>
                                cheese, naga
                              </span>
                              <span className="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                <span className="font-weight-bold">
                                  variation:
                                </span>
                                cheese, naga
                              </span>
                            </div>
                            <div className="col-2 text-center border-right d-flex">
                              <span className="fk-addons-table__info-text text-capitalize m-auto">
                                9
                              </span>
                            </div>
                            <div className="col-1 text-center d-flex">
                              <label className="mx-checkbox mx-checkbox--empty m-auto">
                                <input
                                  type="checkbox"
                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                />
                                <span className="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="fk-order-token__footer text-center">
                    <button
                      type="button"
                      className="btn btn-success xsm-text text-uppercase btn-lg"
                    >
                      order ready
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Kitchen;
