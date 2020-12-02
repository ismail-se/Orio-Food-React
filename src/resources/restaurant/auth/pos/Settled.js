import React, { useEffect, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../BaseUrl";

//functions
import {
  _t,
  getCookie,
  currencySymbolLeft,
  formatPrice,
  currencySymbolRight,
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

const Settled = () => {
  //getting context values here
  const {
    //common
    loading,
    setLoading,
  } = useContext(SettingsContext);

  const {
    //submitted orders
    settledOrders,
    setPaginatedSettledOrders,
    settledOrdersForSearch,

    //payment-type
    paymentTypeForSearch,

    //pagination
    dataPaginating,
  } = useContext(RestaurantContext);

  const { t } = useTranslation();

  // States hook here
  // paidMoney
  const [paidMoney, setPaidMoney] = useState(0);
  //return
  const [returnMoneyUsd, setReturnMoneyUsd] = useState(0);

  //settle order
  const [checkOrderDetails, setCheckOrderDetails] = useState({
    item: null,
    settle: false,
    uploading: false,
    payment_type: null,
    payment_amount: null,
  });

  //search result
  const [searchedOrder, setSearchedOrder] = useState({
    list: null,
    searched: false,
  });

  //useEffect == componentDidMount
  useEffect(() => {}, []);

  //search submitted orders here
  const handleSearch = (e) => {
    let searchInput = e.target.value.toLowerCase();
    if (searchInput.length === 0) {
      setSearchedOrder({ ...searchedOrder, searched: false });
    } else {
      let searchedList = settledOrdersForSearch.filter((item) => {
        //token
        let lowerCaseItemToken = JSON.stringify(item.token.id);

        //customer
        let lowerCaseItemCustomer = item.customer_name.toLowerCase();

        //table
        let lowerCaseItemTable = item.table_name.toLowerCase();

        //branch
        let lowerCaseItemBranch = item.branch_name.toLowerCase();
        return (
          lowerCaseItemToken.includes(searchInput) ||
          lowerCaseItemCustomer.includes(searchInput) ||
          lowerCaseItemTable.includes(searchInput) ||
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

  return (
    <>
      <Helmet>
        <title>{_t(t("Settled orders"))}</title>
      </Helmet>

      {/* Settle modal */}
      <div className="modal fade" id="orderDetails" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  {/* show order token on modal header */}
                  {_t(t("Order details, Token"))}: #
                  {checkOrderDetails.item && checkOrderDetails.item.token.id}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* if loading true show loading effect */}
            {loading ? (
              <div className="modal-body">{modalLoading(5)}</div>
            ) : (
              <div className="modal-body">
                {checkOrderDetails.item &&
                checkOrderDetails.item.is_settled === 0 ? (
                  // if this item is not settled then show settle-cancel button
                  <>
                    {checkOrderDetails.item &&
                      checkOrderDetails.item.is_cancelled !== 1 && (
                        <div className="text-right">
                          {checkOrderDetails.settle &&
                            paidMoney >
                              parseFloat(
                                checkOrderDetails.item.total_payable
                              ) && (
                              <span className="mr-2 text-secondary font-weight-bold">
                                Return: {currencySymbolLeft()}
                                {formatPrice(returnMoneyUsd)}
                                {currencySymbolRight()}{" "}
                              </span>
                            )}
                          {checkOrderDetails.settle ? (
                            <button
                              className="btn btn-primary px-3 rounded-md text-uppercase"
                              onClick={() => {
                                setCheckOrderDetails({
                                  ...checkOrderDetails,
                                  settle: false,
                                  payment_amount: null,
                                  payment_type: null,
                                });
                                setReturnMoneyUsd(0);
                                setPaidMoney(0);
                              }}
                            >
                              {_t(t("Cancel"))}
                            </button>
                          ) : (
                            <button
                              className="btn btn-success px-3 rounded-md text-uppercase"
                              onClick={() => {
                                setCheckOrderDetails({
                                  ...checkOrderDetails,
                                  settle: true,
                                  payment_amount: null,
                                  payment_type: null,
                                });
                                setReturnMoneyUsd(0);
                                setPaidMoney(0);
                              }}
                            >
                              {_t(t("Settle order"))}
                            </button>
                          )}
                        </div>
                      )}
                  </>
                ) : (
                  // if this item is not settled then show settle-cancel button else, show this notification
                  ""
                )}
                {checkOrderDetails.item &&
                  //show this if order is cancelled
                  checkOrderDetails.item.is_cancelled === 1 && (
                    <div className="text-center bg-secondary text-white py-2">
                      {_t(t("This order has been cancelled"))}
                    </div>
                  )}
                {/* show this if order settle is not true, if true show payment input field */}
                {!checkOrderDetails.settle ? (
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
                                  Additional Info
                                </span>
                              </div>
                              <div class="col-2 text-center border-right">
                                <span class="fk-addons-table__info-text text-capitalize">
                                  QTY
                                </span>
                              </div>
                              <div class="col-1 text-center">
                                <span class="fk-addons-table__info-text text-capitalize">
                                  {_t(t("Status"))}
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
                                          {thisItem.food_item} (
                                          {thisItem.food_group})
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
                                            {JSON.parse(
                                              thisItem.properties
                                            ).map((propertyItem, thisIndex) => {
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
                                            })}
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
                ) : (
                  ""
                )}
                <div className="bg-warning text-dark p-2 rounded-lg">
                  <div>
                    {_t(t("Received by"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item &&
                        checkOrderDetails.item.user_name}
                    </span>
                  </div>
                  <div className="text-capitalize">
                    {_t(t("Customer"))}
                    {": "}
                    {checkOrderDetails.item &&
                      checkOrderDetails.item.customer_name}
                  </div>
                  <div className="text-capitalize">
                    {_t(t("Branch"))}
                    {": "}
                    {checkOrderDetails.item &&
                      checkOrderDetails.item.branch_name}
                  </div>
                  <div className="text-capitalize">
                    {_t(t("Department"))}
                    {": "}
                    {checkOrderDetails.item &&
                      checkOrderDetails.item.dept_tag_name}
                  </div>
                  <div className="text-capitalize">
                    {_t(t("Table"))}
                    {": "}
                    {checkOrderDetails.item &&
                      checkOrderDetails.item.table_name}
                  </div>
                  <div className="text-capitalize">
                    {_t(t("Waiter"))}
                    {": "}
                    {checkOrderDetails.item &&
                      checkOrderDetails.item.waiter_name}
                  </div>
                  <div>
                    {_t(t("Subtotal"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item && (
                        <>
                          {currencySymbolLeft()}
                          {formatPrice(checkOrderDetails.item.order_bill)}
                          {currencySymbolRight()}
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    {_t(t("Vat"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item && (
                        <>
                          {currencySymbolLeft()}
                          {formatPrice(checkOrderDetails.item.vat)}
                          {currencySymbolRight()}
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    {_t(t("Service charge"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item && (
                        <>
                          {currencySymbolLeft()}
                          {formatPrice(checkOrderDetails.item.service_charge)}
                          {currencySymbolRight()}
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    {_t(t("Discount"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item && (
                        <>
                          {currencySymbolLeft()}
                          {formatPrice(checkOrderDetails.item.discount)}
                          {currencySymbolRight()}
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    {_t(t("Total bill"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item && (
                        <>
                          {currencySymbolLeft()}
                          {formatPrice(checkOrderDetails.item.total_payable)}
                          {currencySymbolRight()}
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    {_t(t("Paid amount"))}
                    {": "}
                    <span className="text-capitalize">
                      {checkOrderDetails.item && (
                        <>
                          {currencySymbolLeft()}
                          {formatPrice(checkOrderDetails.item.paid_amount)}
                          {currencySymbolRight()}
                        </>
                      )}
                    </span>
                  </div>
                  {checkOrderDetails.item &&
                  parseFloat(
                    checkOrderDetails.item.total_payable -
                      checkOrderDetails.item.paid_amount
                  ) >= 0 ? (
                    <div>
                      {_t(t("Due amount"))}
                      {": "}
                      <span className="text-capitalize">
                        {checkOrderDetails.item && (
                          <>
                            {currencySymbolLeft()}
                            {formatPrice(
                              parseFloat(
                                checkOrderDetails.item.total_payable -
                                  checkOrderDetails.item.paid_amount
                              )
                            )}
                            {currencySymbolRight()}
                          </>
                        )}
                      </span>
                    </div>
                  ) : (
                    <div>
                      {_t(t("Return amount"))}
                      {": "}
                      <span className="text-capitalize">
                        {checkOrderDetails.item && (
                          <>
                            {currencySymbolLeft()}
                            {formatPrice(
                              parseFloat(
                                checkOrderDetails.item.paid_amount -
                                  checkOrderDetails.item.total_payable
                              )
                            )}
                            {currencySymbolRight()}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Settle modal Ends*/}

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
                              ? _t(t("Settled orders"))
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
                              placeholder={
                                _t(t("Search by token, customer, branch")) +
                                ".."
                              }
                              onChange={handleSearch}
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
                            to="/dashboard/pos/submitted"
                            className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-primary xsm-text text-uppercase text-center w-100"
                          >
                            Submitted
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
                            </tr>
                          </thead>
                          <tbody className="align-middle">
                            {/* loop here, logic === !search && haveData && haveDataLegnth > 0*/}
                            {!searchedOrder.searched
                              ? [
                                  settledOrders && [
                                    settledOrders.data.length === 0 ? (
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
                                      settledOrders.data.map((item, index) => {
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
                                                (settledOrders.current_page -
                                                  1) *
                                                  settledOrders.per_page}
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
                                                          settle: false,
                                                        });
                                                        setReturnMoneyUsd(0);
                                                        setPaidMoney(0);
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
                                                          settle: false,
                                                        });
                                                        setReturnMoneyUsd(0);
                                                        setPaidMoney(0);
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
                                                  class="btn btn-transparent btn-primary xsm-text text-capitalize px-3"
                                                  onClick={() => {
                                                    setCheckOrderDetails({
                                                      ...checkOrderDetails,
                                                      item: item,
                                                      settle: false,
                                                    });
                                                    setReturnMoneyUsd(0);
                                                    setPaidMoney(0);
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#orderDetails"
                                                >
                                                  Cancelled
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })
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
                                                (settledOrders.current_page -
                                                  1) *
                                                  settledOrders.per_page}
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
                                                          settle: false,
                                                        });
                                                        setReturnMoneyUsd(0);
                                                        setPaidMoney(0);
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
                                                          settle: false,
                                                        });
                                                        setReturnMoneyUsd(0);
                                                        setPaidMoney(0);
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
                                                  class="btn btn-transparent btn-primary xsm-text text-capitalize px-3"
                                                  onClick={() => {
                                                    setCheckOrderDetails({
                                                      ...checkOrderDetails,
                                                      item: item,
                                                      settle: false,
                                                    });
                                                    setReturnMoneyUsd(0);
                                                    setPaidMoney(0);
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#orderDetails"
                                                >
                                                  Cancelled
                                                </span>
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
                                settledOrders,
                                setPaginatedSettledOrders
                              )}
                            </div>
                            <div className="col-md-5">
                              <ul className="t-list d-flex justify-content-md-end align-items-center">
                                <li className="t-list__item">
                                  <span className="d-inline-block sm-text">
                                    {showingData(settledOrders)}
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
                                    settledOrdersForSearch
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

export default Settled;
