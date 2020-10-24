import React from "react";
import { Helmet } from "react-helmet";
import Switch from "react-switch";
import ManageSidebar from "../ManageSidebar";

const Lang = () => {
  return (
    <>
      <Helmet>
        <title>Languages & Translations</title>
      </Helmet>
      {/* Add Customer */}
      <div className="modal fade" id="addCustomer" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  additional information
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
              <form action="#">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label text-capitalize"
                >
                  add customer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                />
              </form>
            </div>
            <div className="modal-footer">
              <div className="row">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-success w-100 xsm-text text-uppercase t-width-max"
                  >
                    save
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-primary w-100 xsm-text text-uppercase t-width-max"
                    data-dismiss="modal"
                  >
                    cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Customer End*/}

      <main id="main" data-simplebar>
        <div className="container">
          <div className="row t-mt-10 gx-2">
            <div className="col-lg-3 col-xxl-2 t-mb-30 mb-lg-0">
              <ManageSidebar />
            </div>
            <div className="col-lg-9 col-xxl-10 t-mb-30 mb-lg-0">
              <div className="t-bg-white">
                <div className="fk-scroll--pos-menu" data-simplebar>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="nav-1">
                      <div className="t-pl-15 t-pr-15">
                        <div className="row gx-2 align-items-center t-pt-15 t-pb-15">
                          <div className="col-md-4 col-lg-3 t-mb-15 mb-md-0">
                            <ul className="t-list fk-breadcrumb">
                              <li className="fk-breadcrumb__list">
                                <span className="t-link fk-breadcrumb__link text-capitalize">
                                  Language List
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-8 col-lg-9">
                            <div className="row gx-0 align-items-center">
                              <div className="col-md-9 col-xl-10 t-mb-15 mb-md-0">
                                <div className="input-group">
                                  <div className="form-file">
                                    <input
                                      type="text"
                                      className="form-control border-0 form-control--light-1 rounded-0"
                                      placeholder="Search.."
                                    />
                                  </div>
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                  >
                                    <i
                                      className="fa fa-search"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <div className="col-md-3 col-xl-2 text-md-right">
                                <button
                                  type="button"
                                  className="btn btn-primary xsm-text text-uppercase btn-lg"
                                  data-toggle="modal"
                                  data-target="#addCustomer"
                                >
                                  add new
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-bordered min-table-height">
                            <thead className="align-middle">
                              <tr>
                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  S/L
                                </th>

                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  Code
                                </th>
                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  Flag
                                </th>
                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  Set default
                                </th>
                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="align-middle">
                              <tr className="align-middle">
                                <th
                                  scope="row"
                                  className="xsm-text text-capitalize align-middle text-center"
                                >
                                  1
                                </th>

                                <td className="xsm-text align-middle text-center">
                                  en
                                </td>
                                <td className="xsm-text text-capitalize align-middle text-center">
                                  English
                                </td>
                                <td className="xsm-text text-capitalize align-middle text-center">
                                  <div className="d-flex justify-content-center">
                                    {/* todo:: background image dynamic */}
                                    <div class="fk-language__flag"></div>
                                  </div>
                                </td>
                                <td className="xsm-text text-capitalize align-middle text-center">
                                  <Switch
                                    checked={true}
                                    onChange={() => {}}
                                    height={22}
                                    width={44}
                                    offColor="#ee5253"
                                    disabled
                                  />
                                </td>
                                <td className="xsm-text text-capitalize align-middle text-center">
                                  <div className="dropdown">
                                    <button
                                      className="btn t-bg-clear t-text-dark--light-40"
                                      type="button"
                                      data-toggle="dropdown"
                                    >
                                      <i className="fa fa-ellipsis-h"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                      <a
                                        className="dropdown-item sm-text text-capitalize"
                                        href="#"
                                      >
                                        <span className="t-mr-8">
                                          <i className="fa fa-pencil"></i>
                                        </span>
                                        Edit
                                      </a>
                                      <a
                                        className="dropdown-item sm-text text-capitalize"
                                        href="#"
                                      >
                                        <span className="t-mr-8">
                                          <i className="fa fa-refresh"></i>
                                        </span>
                                        Translate
                                      </a>
                                      <a
                                        className="dropdown-item sm-text text-capitalize"
                                        href="#"
                                      >
                                        <span className="t-mr-8">
                                          <i className="fa fa-trash"></i>
                                        </span>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-bg-white mt-1 t-pt-5 t-pb-5">
                <div className="row align-items-center t-pl-15 t-pr-15">
                  <div className="col-md-7 t-mb-15 mb-md-0">
                    <ul className="t-list d-flex">
                      <li className="t-list__item">
                        <a
                          href="#"
                          className="t-link t-pt-5 t-pb-5 t-pl-10 t-pr-10 paginav__link paginav__link--light border text-capitalize sm-text"
                        >
                          <i className="las la-angle-double-left"></i>
                        </a>
                      </li>
                      <li className="t-list__item">
                        <a
                          href="#"
                          className="t-link t-pt-5 t-pb-5 t-pl-10 t-pr-10 paginav__link paginav__link--light border text-capitalize sm-text active"
                        >
                          2
                        </a>
                      </li>
                      <li className="t-list__item">
                        <a
                          href="#"
                          className="t-link t-pt-5 t-pb-5 t-pl-10 t-pr-10 paginav__link paginav__link--light border text-capitalize sm-text"
                        >
                          3
                        </a>
                      </li>
                      <li className="t-list__item">
                        <a
                          href="#"
                          className="t-link t-pt-5 t-pb-5 t-pl-10 t-pr-10 paginav__link paginav__link--light border text-capitalize sm-text"
                        >
                          4
                        </a>
                      </li>
                      <li className="t-list__item">
                        <a
                          href="#"
                          className="t-link t-pt-5 t-pb-5 t-pl-10 t-pr-10 paginav__link paginav__link--light border text-capitalize sm-text"
                        >
                          5
                        </a>
                      </li>
                      <li className="t-list__item">
                        <a
                          href="#"
                          className="t-link t-pt-5 t-pb-5 t-pl-10 t-pr-10 paginav__link paginav__link--light border text-capitalize sm-text"
                        >
                          <i className="las la-angle-double-right"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-5">
                    <ul className="t-list d-flex justify-content-md-end align-items-center">
                      <li className="t-list__item">
                        <span className="d-inline-block text-capitalize sm-text">
                          showing 10 -20 of 300
                        </span>
                      </li>
                    </ul>
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

export default Lang;
