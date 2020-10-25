import React, { useState, useEffect } from "react";

//3rd party packages
import { Helmet } from "react-helmet";
import Switch from "react-switch";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ContentLoader from "react-content-loader";

//sidebar of manage page
import ManageSidebar from "../ManageSidebar";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../../BaseUrl";

const Lang = () => {
  // States hook here
  const [newLang, setNewLang] = useState({
    name: "",
    code: "",
    image: null,
    uploading: false,
  });

  //useEffect == componentDidMount()
  useEffect(() => {}, []);

  //set hook state for name, code
  const handleSetNewLang = (e) => {
    setNewLang({ ...newLang, [e.target.name]: e.target.value });
  };
  //set hook state for flag
  const handleLangFlag = (e) => {
    setNewLang({
      ...newLang,
      [e.target.name]: e.target.files[0],
    });
  };

  //Save New Language
  const handleSaveNewLang = (e) => {
    e.preventDefault();
    setNewLang({
      ...newLang,
      uploading: true,
    });
    // const langUrl = BASE_URL + `/settings/new-lang`;
    // let formData = new FormData();
    // formData.append("name", newLang.name);
    // formData.append("code", newLang.code);
    // formData.append("image", newLang.image);
    // // todo:: add Authorization here
    // return axios.post(langUrl, formData).then((res) => {
    //   console.log(res.data);
    // });
  };

  //delete language
  const handleDeleteConfirmation = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="card card-body">
            <h1>Are you sure?</h1>
            <p className="text-center">You want to delete this?</p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                }}
              >
                Yes, delete it!
              </button>
              <button className="btn btn-success ml-2 px-3" onClick={onClose}>
                No
              </button>
            </div>
          </div>
        );
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>Languages & Translations</title>
      </Helmet>
      {/* Add Customer */}
      <div className="modal fade" id="addCustomer" aria-hidden="true">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  Add new language
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
              {newLang.uploading === false ? (
                <>
                  <form onSubmit={handleSaveNewLang}>
                    <div>
                      <label htmlFor="name" className="form-label">
                        Name <small className="text-primary">*</small>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="e.g. English"
                        required
                        onChange={handleSetNewLang}
                      />
                    </div>

                    <div className="mt-2">
                      <label htmlFor="code" className="form-label">
                        code <small className="text-primary">*</small>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        name="code"
                        onChange={handleSetNewLang}
                        required
                        placeholder="e.g. EN for english"
                      />
                    </div>

                    <div className="mt-2">
                      <label htmlFor="image" className="form-label">
                        Flag
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={handleLangFlag}
                      />
                    </div>
                    <div className="mt-4">
                      <div className="row">
                        <div className="col-6">
                          <button
                            type="submit"
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
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center text-primary text-uppercase">
                    Please wait
                  </div>
                  <ContentLoader
                    viewBox="0 0 380 70"
                    backgroundColor={"#ff7675"}
                  >
                    {/* Only SVG shapes */}
                    <rect x="0" y="5" rx="2" ry="2" width="100%" height="15" />
                    <rect x="0" y="30" rx="2" ry="2" width="100%" height="15" />
                    <rect x="0" y="55" rx="2" ry="2" width="100%" height="15" />
                    <rect x="0" y="80" rx="2" ry="2" width="100%" height="15" />
                  </ContentLoader>
                  <div className="mt-4">
                    <div className="row">
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-success w-100 xsm-text text-uppercase t-width-max"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
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
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                              <button className="btn btn-primary" type="button">
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
                                <div
                                  class="fk-language__flag"
                                  // style={{
                                  //   backgroundImage: `url(${
                                  //     BASE_URL +
                                  //     "/public/images/flags/default.png"
                                  //   })`,
                                  // }}
                                ></div>
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
                                  <button
                                    className="dropdown-item sm-text text-capitalize"
                                    onClick={handleDeleteConfirmation}
                                  >
                                    <span className="t-mr-8">
                                      <i className="fa fa-trash"></i>
                                    </span>
                                    Delete
                                  </button>
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
