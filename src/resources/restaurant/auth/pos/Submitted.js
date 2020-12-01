import React, { useEffect, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../BaseUrl";

//functions
import {
  _t,
  getCookie,
  modalLoading,
  pageLoading,
  paginationLoading,
  pagination,
  showingData,
  searchedShowingData,
} from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";

//importing context consumer here
import { UserContext } from "../../../../contexts/User";
import { SettingsContext } from "../../../../contexts/Settings";
import { RestaurantContext } from "../../../../contexts/Restaurant";

const Submitted = () => {
  //getting context values here
  const {
    //common
    loading,
    setLoading,
  } = useContext(SettingsContext);

  const { authUserInfo } = useContext(UserContext);

  const {
    //branch
    branchForSearch,

    //submitted orders
    getSubmittedOrders,
    submittedOrders,
    setSubmittedOrders,
    setPaginatedSubmittedOrders,
    submittedOrdersForSearch,
    setSubmittedOrdersForSearch,

    //pagination
    dataPaginating,
  } = useContext(RestaurantContext);

  const { t } = useTranslation();

  // States hook here
  //new customer
  let [checkOrderDetails, setCheckOrderDetails] = useState({
    item: null,
    uploading: false,
  });

  //search result
  let [searchedOrder, setSearchedOrder] = useState({
    list: null,
    searched: false,
  });

  //useEffect == componentDidMount
  useEffect(() => {}, []);

  //set edit true & values
  const handleSetEdit = (id) => {};

  //search customers here
  const handleSearch = (e) => {
    let searchInput = e.target.value.toLowerCase();
    if (searchInput.length === 0) {
      setSearchedOrder({ ...searchedOrder, searched: false });
    } else {
      let searchedList = submittedOrdersForSearch.filter((item) => {
        //name
        let lowerCaseItemName = item.name.toLowerCase();

        //email
        let lowerCaseItemEmail =
          item.email !== null && item.email.toLowerCase();

        //phn no
        let lowerCaseItemPhnNo =
          item.phn_no !== null && item.phn_no.toLowerCase();

        //address
        let lowerCaseItemAddress =
          item.address !== null && item.address.toLowerCase();

        //branch
        let lowerCaseItemBranch =
          item.branch_name !== null && item.branch_name.toLowerCase();
        return (
          lowerCaseItemName.includes(searchInput) ||
          (lowerCaseItemEmail && lowerCaseItemEmail.includes(searchInput)) ||
          (lowerCaseItemPhnNo && lowerCaseItemPhnNo.includes(searchInput)) ||
          (lowerCaseItemAddress &&
            lowerCaseItemAddress.includes(searchInput)) ||
          (lowerCaseItemBranch && lowerCaseItemBranch.includes(searchInput))
        );
      });
      setSearchedOrder({
        ...searchedOrder,
        list: searchedList,
        searched: true,
      });
    }
  };

  //delete confirmation modal of waiter
  const handleDeleteConfirmation = (slug) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="card card-body">
            <h1>{_t(t("Are you sure?"))}</h1>
            <p className="text-center">{_t(t("You want to delete this?"))}</p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  // handleDeleteCustomer(slug);
                  onClose();
                }}
              >
                {_t(t("Yes, delete it!"))}
              </button>
              <button className="btn btn-success ml-2 px-3" onClick={onClose}>
                {_t(t("No"))}
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
        <title>{_t(t("Submitted orders"))}</title>
      </Helmet>

      {/* Add modal */}
      <div className="modal fade" id="orderDetails" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  {_t(t("Order details"))}
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
              <div class="col-12 filtr-item">
                <div class="fk-order-token t-bg-white">
                  <div class="fk-order-token__body">
                    <div class="fk-addons-table">
                      <div class="fk-addons-table__head text-center">
                        order token: #
                        {checkOrderDetails.item &&
                          checkOrderDetails.item.token.id}
                      </div>
                      <div class="fk-addons-table__info">
                        <div class="row g-0">
                          <div class="col-2 text-center border-right">
                            <span class="fk-addons-table__info-text text-capitalize">
                              S/L
                            </span>
                          </div>
                          <div class="col-3 text-center border-right">
                            <span class="fk-addons-table__info-text text-capitalize">
                              food
                            </span>
                          </div>
                          <div class="col-4 text-left pl-2 border-right">
                            <span class="fk-addons-table__info-text text-capitalize">
                              Additional
                            </span>
                          </div>
                          <div class="col-2 text-center border-right">
                            <span class="fk-addons-table__info-text text-capitalize">
                              QTY
                            </span>
                          </div>
                          <div class="col-1 text-center">
                            <span class="fk-addons-table__info-text text-capitalize">
                              <i class="fa fa-check"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      {checkOrderDetails.item &&
                        checkOrderDetails.item.orderedItems.map(
                          (thisItem, indexThisItem) => {
                            return (
                              <div class="fk-addons-table__body-row">
                                <div class="row g-0">
                                  <div class="col-2 text-center border-right d-flex">
                                    <span class="fk-addons-table__info-text text-capitalize m-auto">
                                      {indexThisItem + 1}
                                    </span>
                                  </div>
                                  <div class="col-3 text-center border-right d-flex">
                                    <span class="fk-addons-table__info-text text-capitalize m-auto">
                                      {thisItem.food_item}
                                    </span>
                                  </div>
                                  <div class="col-4 text-center border-right t-pl-10 t-pr-10">
                                    {thisItem.variation !== null && (
                                      <span class="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                        <span class="font-weight-bold mr-1">
                                          variation:
                                        </span>
                                        {thisItem.variation}
                                      </span>
                                    )}

                                    {thisItem.properties !== null && (
                                      <span class="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                        <span class="font-weight-bold mr-1">
                                          properties:
                                        </span>
                                        {JSON.parse(thisItem.properties).map(
                                          (propertyItem, thisIndex) => {
                                            if (
                                              thisIndex !==
                                              JSON.parse(thisItem.properties)
                                                .length -
                                                1
                                            ) {
                                              return (
                                                propertyItem.property + ", "
                                              );
                                            } else {
                                              return propertyItem.property;
                                            }
                                          }
                                        )}
                                      </span>
                                    )}
                                  </div>
                                  <div class="col-2 text-center border-right d-flex">
                                    <span class="fk-addons-table__info-text text-capitalize m-auto">
                                      {thisItem.quantity}
                                    </span>
                                  </div>

                                  <div class="col-1 text-center d-flex">
                                    <label class="mx-checkbox mx-checkbox--empty m-auto">
                                      <span class="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text">
                                        {thisItem.is_cooking === 1 ? (
                                          [
                                            thisItem.is_ready === 1 ? (
                                              <i
                                                className="fa fa-check text-success"
                                                title={_t(t("Ready"))}
                                              ></i>
                                            ) : (
                                              <i
                                                className="fa fa-cutlery text-secondary"
                                                title={_t(t("Cooking"))}
                                              ></i>
                                            ),
                                          ]
                                        ) : (
                                          <i
                                            className="fa fa-times text-primary"
                                            title={_t(t("Pending"))}
                                          ></i>
                                        )}
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add modal Ends*/}

      {/* main body */}
      <main id="main" data-simplebar>
        <div className="container">
          <div className="row t-mt-10 gx-2">
            <div className="col-12 t-mb-30 mb-lg-0">
              {checkOrderDetails.uploading === true || loading === true ? (
                pageLoading()
              ) : (
                <div className="t-bg-white ">
                  {/* next page data spin loading */}
                  <div className={`${dataPaginating && "loading"}`}></div>
                  {/* spin loading ends */}
                  <div className="row gx-2 align-items-center t-pt-15 t-pb-15 t-pl-15 t-pr-15 t-shadow">
                    <div className="col-12 t-mb-15">
                      <ul className="t-list fk-breadcrumb">
                        <li className="fk-breadcrumb__list">
                          <span className="t-link fk-breadcrumb__link text-capitalize">
                            {!searchedOrder.searched
                              ? _t(t("Submitted orders"))
                              : _t(t("Search Result"))}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6 col-lg-5 t-mb-15 mb-md-0">
                      <ul className="t-list fk-sort align-items-center">
                        <div className="input-group col">
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
                      </ul>
                    </div>
                    <div className="col-md-6 col-lg-7">
                      <div className="row align-items-center gx-2">
                        <div className="col"></div>
                        <div className="col">
                          <NavLink
                            to="/dashboard/pos"
                            className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-secondary xsm-text text-uppercase text-center w-100"
                          >
                            POS
                          </NavLink>
                        </div>
                        <div className="col">
                          <NavLink
                            to="/dashboard/pos/settled"
                            className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-success xsm-text text-uppercase text-center w-100"
                          >
                            Settled
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="fk-scroll--order-history" data-simplebar>
                    <div className="t-pl-15 t-pr-15">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover min-table-height mt-4">
                          <thead className="align-middle">
                            <tr>
                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("S/L"))}
                              </th>

                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Token"))}
                              </th>
                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Time"))}
                              </th>
                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Customer"))}
                              </th>

                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Table"))}
                              </th>

                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Branch"))}
                              </th>

                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Status"))}
                              </th>

                              <th
                                scope="col"
                                className="sm-text text-capitalize align-middle text-center border-1 border"
                              >
                                {_t(t("Action"))}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="align-middle">
                            {/* loop here, logic === !search && haveData && haveDataLegnth > 0*/}
                            {!searchedOrder.searched
                              ? [
                                  submittedOrders && [
                                    submittedOrders.data.length === 0 ? (
                                      <tr className="align-middle">
                                        <td
                                          scope="row"
                                          colSpan="8"
                                          className="xsm-text align-middle text-center"
                                        >
                                          {_t(t("No data available"))}
                                        </td>
                                      </tr>
                                    ) : (
                                      submittedOrders.data.map(
                                        (item, index) => {
                                          return (
                                            <tr
                                              className="align-middle"
                                              key={index}
                                            >
                                              <th
                                                scope="row"
                                                className="xsm-text text-capitalize align-middle text-center"
                                              >
                                                {index +
                                                  1 +
                                                  (submittedOrders.current_page -
                                                    1) *
                                                    submittedOrders.per_page}
                                              </th>

                                              <td className="xsm-text text-capitalize align-middle text-center text-secondary">
                                                #{item.token.id}
                                              </td>

                                              <td className="xsm-text text-capitalize align-middle text-center">
                                                <Moment format="LT">
                                                  {item.token.time}
                                                </Moment>
                                              </td>

                                              <td className="xsm-text align-middle text-center">
                                                {item.customer_name}
                                              </td>

                                              <td className="xsm-text align-middle text-center">
                                                {item.table_name}
                                              </td>

                                              <td className="xsm-text align-middle text-center">
                                                {item.branch_name || "-"}
                                              </td>

                                              <td class="xsm-text text-capitalize align-middle text-center">
                                                {item.is_cancelled === 0 ? (
                                                  [
                                                    item.is_ready === 0 ? (
                                                      <span
                                                        class="btn btn-transparent btn-secondary xsm-text text-capitalize"
                                                        onClick={() => {
                                                          setCheckOrderDetails({
                                                            ...checkOrderDetails,
                                                            item: item,
                                                          });
                                                        }}
                                                        data-toggle="modal"
                                                        data-target="#orderDetails"
                                                      >
                                                        processing
                                                      </span>
                                                    ) : (
                                                      <span
                                                        class="btn btn-transparent btn-success xsm-text text-capitalize px-4"
                                                        onClick={() => {
                                                          setCheckOrderDetails({
                                                            ...checkOrderDetails,
                                                            item: item,
                                                          });
                                                        }}
                                                        data-toggle="modal"
                                                        data-target="#orderDetails"
                                                      >
                                                        Ready
                                                      </span>
                                                    ),
                                                  ]
                                                ) : (
                                                  <span
                                                    class="btn btn-transparent btn-warning xsm-text text-capitalize px-3"
                                                    onClick={() => {
                                                      setCheckOrderDetails({
                                                        ...checkOrderDetails,
                                                        item: item,
                                                      });
                                                    }}
                                                    data-toggle="modal"
                                                    data-target="#orderDetails"
                                                  >
                                                    Cancelled
                                                  </span>
                                                )}
                                              </td>

                                              <td className="xsm-text text-capitalize align-middle text-center">
                                                {item.is_cancelled === 0 ? (
                                                  <div className="dropdown">
                                                    <button
                                                      className="btn t-bg-clear t-text-dark--light-40"
                                                      type="button"
                                                      data-toggle="dropdown"
                                                    >
                                                      <i className="fa fa-ellipsis-h"></i>
                                                    </button>
                                                    <div className="dropdown-menu">
                                                      <button
                                                        className="dropdown-item sm-text text-capitalize"
                                                        onClick={() => {
                                                          setCheckOrderDetails({
                                                            ...checkOrderDetails,
                                                            item: item,
                                                          });
                                                        }}
                                                        data-toggle="modal"
                                                        data-target="#orderDetails"
                                                      >
                                                        <span className="t-mr-8">
                                                          <i className="fa fa-eye"></i>
                                                        </span>
                                                        {_t(t("Details"))}
                                                      </button>
                                                      {item.is_ready !== 1 && [
                                                        item.is_accepted ===
                                                        0 ? (
                                                          <button
                                                            className="dropdown-item sm-text text-capitalize"
                                                            onClick={() => {
                                                              handleDeleteConfirmation(
                                                                item.slug
                                                              );
                                                            }}
                                                          >
                                                            <span className="t-mr-8">
                                                              <i className="fa fa-trash"></i>
                                                            </span>
                                                            {_t(
                                                              t("Cancel Order")
                                                            )}
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="dropdown-item sm-text text-capitalize"
                                                            onClick={() => {
                                                              toast.error(
                                                                `${_t(
                                                                  t(
                                                                    "This is being cooked, can not cancel now, try removing items"
                                                                  )
                                                                )}`,
                                                                {
                                                                  position:
                                                                    "bottom-center",
                                                                  closeButton: false,
                                                                  autoClose: 10000,
                                                                  hideProgressBar: false,
                                                                  closeOnClick: true,
                                                                  pauseOnHover: true,
                                                                  className:
                                                                    "text-center toast-notification",
                                                                }
                                                              );
                                                            }}
                                                          >
                                                            <span className="t-mr-8">
                                                              <i className="fa fa-trash text-primary"></i>
                                                            </span>
                                                            {_t(
                                                              t("Cancel Order")
                                                            )}
                                                          </button>
                                                        ),
                                                      ]}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  _t(t("Not allowed"))
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    ),
                                  ],
                                ]
                              : [
                                  /* searched data, logic === haveData*/
                                  searchedOrder && [
                                    searchedOrder.list.length === 0 ? (
                                      <tr className="align-middle">
                                        <td
                                          scope="row"
                                          colSpan="8"
                                          className="xsm-text align-middle text-center"
                                        >
                                          {_t(t("No data available"))}
                                        </td>
                                      </tr>
                                    ) : (
                                      searchedOrder.list.map((item, index) => {
                                        return (
                                          <tr
                                            className="align-middle"
                                            key={index}
                                          >
                                            <th
                                              scope="row"
                                              className="xsm-text text-capitalize align-middle text-center"
                                            >
                                              {index +
                                                1 +
                                                (submittedOrders.current_page -
                                                  1) *
                                                  submittedOrders.per_page}
                                            </th>

                                            <td className="xsm-text text-capitalize align-middle text-center text-secondary">
                                              #{item.token.id}
                                            </td>

                                            <td className="xsm-text text-capitalize align-middle text-center">
                                              <Moment format="LT">
                                                {item.token.time}
                                              </Moment>
                                            </td>

                                            <td className="xsm-text align-middle text-center">
                                              {item.customer_name}
                                            </td>

                                            <td className="xsm-text align-middle text-center">
                                              {item.table_name}
                                            </td>

                                            <td className="xsm-text align-middle text-center">
                                              {item.branch_name || "-"}
                                            </td>

                                            <td class="xsm-text text-capitalize align-middle text-center">
                                              {item.is_cancelled === 0 ? (
                                                <span
                                                  class="btn btn-transparent btn-secondary xsm-text text-capitalize"
                                                  onClick={() => {
                                                    setCheckOrderDetails({
                                                      ...checkOrderDetails,
                                                      item: item,
                                                    });
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#orderDetails"
                                                >
                                                  processing
                                                </span>
                                              ) : (
                                                <span
                                                  class="btn btn-transparent btn-warning xsm-text text-capitalize px-3"
                                                  onClick={() => {
                                                    setCheckOrderDetails({
                                                      ...checkOrderDetails,
                                                      item: item,
                                                    });
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#orderDetails"
                                                >
                                                  Cancelled
                                                </span>
                                              )}
                                            </td>

                                            <td className="xsm-text text-capitalize align-middle text-center">
                                              {item.is_cancelled === 0 ? (
                                                <div className="dropdown">
                                                  <button
                                                    className="btn t-bg-clear t-text-dark--light-40"
                                                    type="button"
                                                    data-toggle="dropdown"
                                                  >
                                                    <i className="fa fa-ellipsis-h"></i>
                                                  </button>
                                                  <div className="dropdown-menu">
                                                    <button
                                                      className="dropdown-item sm-text text-capitalize"
                                                      onClick={() => {
                                                        setCheckOrderDetails({
                                                          ...checkOrderDetails,
                                                          item: item,
                                                        });
                                                      }}
                                                      data-toggle="modal"
                                                      data-target="#orderDetails"
                                                    >
                                                      <span className="t-mr-8">
                                                        <i className="fa fa-eye"></i>
                                                      </span>
                                                      {_t(t("Details"))}
                                                    </button>
                                                    <button
                                                      className="dropdown-item sm-text text-capitalize"
                                                      onClick={() => {
                                                        handleDeleteConfirmation(
                                                          item.slug
                                                        );
                                                      }}
                                                    >
                                                      <span className="t-mr-8">
                                                        <i className="fa fa-trash"></i>
                                                      </span>
                                                      {_t(t("Cancel Order"))}
                                                    </button>
                                                  </div>
                                                </div>
                                              ) : (
                                                _t(t("Not allowed"))
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })
                                    ),
                                  ],
                                ]}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* pagination loading effect */}
              {checkOrderDetails.uploading === true || loading === true
                ? paginationLoading()
                : [
                    // logic === !searched
                    !searchedOrder.searched ? (
                      <div key="fragment4">
                        <div className="t-bg-white mt-1 t-pt-5 t-pb-5">
                          <div className="row align-items-center t-pl-15 t-pr-15">
                            <div className="col-md-7 t-mb-15 mb-md-0">
                              {/* pagination function */}
                              {pagination(
                                submittedOrders,
                                setPaginatedSubmittedOrders
                              )}
                            </div>
                            <div className="col-md-5">
                              <ul className="t-list d-flex justify-content-md-end align-items-center">
                                <li className="t-list__item">
                                  <span className="d-inline-block sm-text">
                                    {showingData(submittedOrders)}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // if searched
                      <div className="t-bg-white mt-1 t-pt-5 t-pb-5">
                        <div className="row align-items-center t-pl-15 t-pr-15">
                          <div className="col-md-7 t-mb-15 mb-md-0">
                            <ul className="t-list d-flex">
                              <li className="t-list__item no-pagination-style">
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    setSearchedOrder({
                                      ...searchedOrder,
                                      searched: false,
                                    })
                                  }
                                >
                                  {_t(t("Clear Search"))}
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-5">
                            <ul className="t-list d-flex justify-content-md-end align-items-center">
                              <li className="t-list__item">
                                <span className="d-inline-block sm-text">
                                  {searchedShowingData(
                                    searchedOrder,
                                    submittedOrdersForSearch
                                  )}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ),
                  ]}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Submitted;
