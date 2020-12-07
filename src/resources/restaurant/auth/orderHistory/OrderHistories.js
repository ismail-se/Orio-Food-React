import React, { useEffect, useContext, useState } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../BaseUrl";

//functions
import {
  _t,
  currencySymbolLeft,
  formatPrice,
  currencySymbolRight,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "react-moment";

//importing context consumer here
import { UserContext } from "../../../../contexts/User";
import { RestaurantContext } from "../../../../contexts/Restaurant";

const OrderHistories = () => {
  //getting context values here
  const { authUserInfo } = useContext(UserContext);

  const {
    //branch
    branchForSearch,

    //order histories
    allOrders,
    setPaginatedAllOrders,
    allOrdersForSearch,

    //common
    loading,
    setLoading,

    //pagination
    dataPaginating,
    setDataPaginating,
  } = useContext(RestaurantContext);

  const { t } = useTranslation();

  // States hook here
  //settle order
  const [checkOrderDetails, setCheckOrderDetails] = useState({
    item: null,
    settle: false,
    uploading: false,
    payment_type: null,
    payment_amount: null,
  });
  //search result
  let [searchedOrders, setSearchedOrders] = useState({
    list: null,
    searched: false,
    branch: null,
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  //useEffect == componentDidMount
  useEffect(() => {}, []);

  //cancel order confirmation modal
  const handleDeleteOrderConfirmation = (orderGroup) => {
    console.log(orderGroup);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="card card-body">
            <h1>{_t(t("Are you sure?"))}</h1>
            <p className="text-center">
              {_t(t("You want to delete this order?"))}
            </p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleDeleteOrder(orderGroup);
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

  //cancel order here
  const handleDeleteOrder = (orderGroup) => {
    let url = BASE_URL + "/settings/delete-order-from-history";
    let formData = {
      id: orderGroup.id,
    };
    setLoading(true);
    axios
      .post(url, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then(() => {
        setLoading(false);
        setSearchedOrders({
          ...searchedOrders,
          searched: false,
        });
        toast.success(`${_t(t("Deleted successfully"))}`, {
          position: "bottom-center",
          closeButton: false,
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      })
      .catch(() => {
        setLoading(false);
        toast.error(`${_t(t("Please try again"))}`, {
          position: "bottom-center",
          closeButton: false,
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      });
  };

  //search submitted orders here
  const handleSearch = (e) => {
    let searchInput = e.target.value.toLowerCase();
    if (searchInput.length === 0) {
      setSearchedOrders({ ...searchedOrders, searched: false });
    } else {
      let searchedList = allOrdersForSearch.filter((item) => {
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
      setSearchedOrders({
        ...searchedOrders,
        list: searchedList,
        searched: true,
      });
    }
  };

  //branch wise filter
  const handleBranchFilter = (branch) => {
    let searchInput = branch.name.toLowerCase();
    let searchedList = allOrdersForSearch.filter((item) => {
      //branch
      let lowerCaseItemBranch = item.branch_name.toLowerCase();
      return lowerCaseItemBranch && lowerCaseItemBranch.includes(searchInput);
    });
    setSearchedOrders({
      ...searchedOrders,
      list: searchedList,
      searched: true,
      branch,
    });
  };

  //date wise filter
  const handleDateFilter = () => {
    if (startDate !== null && endDate !== null) {
      var fromDate = startDate.toISOString();
      var toDate = endDate.toISOString();

      var fromMilliseconds = new Date(fromDate).getTime();
      var toMilliseconds = new Date(toDate).getTime() + 60 * 60 * 24 * 1000;

      let searchedList = null;
      if (searchedOrders.branch !== null) {
        searchedList = searchedOrders.list.filter((item) => {
          let itemDate = new Date(item.created_at).getTime();

          return itemDate >= fromMilliseconds && itemDate <= toMilliseconds;
        });
      } else {
        searchedList = allOrdersForSearch.filter((item) => {
          let itemDate = new Date(item.created_at).getTime();

          return itemDate >= fromMilliseconds && itemDate <= toMilliseconds;
        });
      }
      setDataPaginating(true);
      setSearchedOrders({
        ...searchedOrders,
        list: searchedList,
        searched: true,
      });
      setTimeout(() => {
        setDataPaginating(false);
      }, 500);
    } else {
      toast.error(`${_t(t("Please select the dates to filter"))}`, {
        position: "bottom-center",
        closeButton: false,
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        className: "text-center toast-notification",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{_t(t("Order history"))}</title>
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
        <div className="container-fluid">
          <div className="row t-mt-10 gx-2">
            <div className="col-12 t-mb-30 mb-lg-0">
              {loading === true ? (
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
                          <span className="t-link fk-breadcrumb__link text-uppercase">
                            {searchedOrders.searched === false
                              ? _t(t("Order history"))
                              : _t(t("Filtered order history"))}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-4 col-lg-3">
                      <div className="input-group">
                        <button className="btn btn-primary" type="button">
                          <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                        <div className="form-file">
                          <input
                            type="text"
                            className="form-control border-0 form-control--light-1 rounded-0"
                            placeholder={
                              _t(t("Search by token, customer, branch")) + ".."
                            }
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                    {/* large screen  */}
                    <div className="col-md-8 col-lg-9 t-mb-15 mb-md-0 d-none d-md-block">
                      <ul className="t-list fk-sort align-items-center justify-content-end">
                        {authUserInfo.details !== null &&
                          authUserInfo.details.user_type !== "staff" && (
                            <li
                              className="fk-sort__list "
                              style={{ minWidth: "150px" }}
                            >
                              <Select
                                options={branchForSearch && branchForSearch}
                                components={makeAnimated()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                className="xsm-text"
                                onChange={handleBranchFilter}
                                maxMenuHeight="200px"
                                placeholder={_t(t("Select branch")) + ".."}
                              />
                            </li>
                          )}
                        <li className="fk-sort__list ml-2">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="form-control xsm-text py-2"
                            placeholderText={_t(t("From date"))}
                            shouldCloseOnSelect={false}
                          />
                        </li>
                        <li className="fk-sort__list">
                          <span className="fk-sort__icon">
                            <span className="fa fa-long-arrow-right"></span>
                          </span>
                        </li>
                        <li className="fk-sort__list">
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="form-control xsm-text py-2"
                            placeholderText={_t(t("To date"))}
                            shouldCloseOnSelect={false}
                          />
                        </li>
                        <li class="fk-sort__list">
                          <button
                            class="btn btn-transparent btn-danger xsm-text text-uppercase py-2"
                            onClick={handleDateFilter}
                          >
                            Filter
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* mobile screen  */}
                    <div className="col-md-8 col-lg-9 t-mb-15 mb-md-0 d-block d-md-none">
                      <ul className="t-list fk-sort align-items-center justify-content-end">
                        {authUserInfo.details !== null &&
                          authUserInfo.details.user_type !== "staff" && (
                            <li
                              className="fk-sort__list w-100 mt-2"
                              style={{ minWidth: "150px" }}
                            >
                              <Select
                                options={branchForSearch && branchForSearch}
                                components={makeAnimated()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                className="xsm-text w-100"
                                onChange={handleBranchFilter}
                                maxMenuHeight="200px"
                                placeholder={_t(t("Select branch")) + ".."}
                              />
                            </li>
                          )}
                        <li
                          className={`fk-sort__list w-100 ${
                            authUserInfo.details !== null &&
                            authUserInfo.details.user_type !== "staff"
                              ? ""
                              : "mt-2"
                          }`}
                        >
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="form-control xsm-text py-2 w-100"
                            shouldCloseOnSelect={false}
                          />
                        </li>
                        <li className="fk-sort__list w-100">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="form-control xsm-text py-2 w-100"
                            shouldCloseOnSelect={false}
                          />
                        </li>
                        <li class="fk-sort__list w-100">
                          <button
                            class="btn btn-transparent btn-danger xsm-text text-uppercase py-2"
                            onClick={handleDateFilter}
                          >
                            Filter
                          </button>
                        </li>
                      </ul>
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
                                {_t(t("Date"))}
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
                            {!searchedOrders.searched
                              ? [
                                  allOrders && [
                                    allOrders.data.length === 0 ? (
                                      <tr className="align-middle">
                                        <td
                                          scope="row"
                                          colSpan="9"
                                          className="xsm-text align-middle text-center"
                                        >
                                          {_t(t("No data available"))}
                                        </td>
                                      </tr>
                                    ) : (
                                      allOrders.data.map((item, index) => {
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
                                                (allOrders.current_page - 1) *
                                                  allOrders.per_page}
                                            </th>

                                            <td className="xsm-text text-capitalize align-middle text-center text-secondary">
                                              #{item.token.id}
                                            </td>

                                            <td className="xsm-text text-capitalize align-middle text-center">
                                              <Moment format="LT">
                                                {item.token.time}
                                              </Moment>
                                            </td>

                                            <td className="xsm-text text-capitalize align-middle text-center">
                                              <Moment format="LL">
                                                {item.created_at}
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
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#orderDetails"
                                                >
                                                  Cancelled
                                                </span>
                                              )}
                                            </td>

                                            <td className="xsm-text align-middle text-center">
                                              <div className="dropdown text-capitalize">
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
                                                      handleDeleteOrderConfirmation(
                                                        item
                                                      );
                                                    }}
                                                  >
                                                    <span className="t-mr-8">
                                                      <i className="fa fa-trash"></i>
                                                    </span>
                                                    {_t(t("Delete Order"))}
                                                  </button>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    ),
                                  ],
                                ]
                              : [
                                  /* searched data, logic === haveData*/
                                  searchedOrders && [
                                    searchedOrders.list.length === 0 ? (
                                      <tr className="align-middle">
                                        <td
                                          scope="row"
                                          colSpan="9"
                                          className="xsm-text align-middle text-center"
                                        >
                                          {_t(t("No data available"))}
                                        </td>
                                      </tr>
                                    ) : (
                                      searchedOrders.list.map((item, index) => {
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
                                                (allOrders.current_page - 1) *
                                                  allOrders.per_page}
                                            </th>

                                            <td className="xsm-text text-capitalize align-middle text-center text-secondary">
                                              #{item.token.id}
                                            </td>

                                            <td className="xsm-text text-capitalize align-middle text-center">
                                              <Moment format="LT">
                                                {item.token.time}
                                              </Moment>
                                            </td>

                                            <td className="xsm-text text-capitalize align-middle text-center">
                                              <Moment format="LL">
                                                {item.created_at}
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
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#orderDetails"
                                                >
                                                  Cancelled
                                                </span>
                                              )}
                                            </td>
                                            <td className="xsm-text align-middle text-center">
                                              <div className="dropdown text-capitalize">
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
                                                      handleDeleteOrderConfirmation(
                                                        item
                                                      );
                                                    }}
                                                  >
                                                    <span className="t-mr-8">
                                                      <i className="fa fa-trash"></i>
                                                    </span>
                                                    {_t(t("Delete Order"))}
                                                  </button>
                                                </div>
                                              </div>
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
              {loading === true
                ? paginationLoading()
                : [
                    // logic === !searched
                    !searchedOrders.searched ? (
                      <div key="fragment4">
                        <div className="t-bg-white mt-1 t-pt-5 t-pb-5">
                          <div className="row align-items-center t-pl-15 t-pr-15">
                            <div className="col-md-7 t-mb-15 mb-md-0">
                              {/* pagination function */}
                              {pagination(allOrders, setPaginatedAllOrders)}
                            </div>
                            <div className="col-md-5">
                              <ul className="t-list d-flex justify-content-md-end align-items-center">
                                <li className="t-list__item">
                                  <span className="d-inline-block sm-text">
                                    {showingData(allOrders)}
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
                                    setSearchedOrders({
                                      ...searchedOrders,
                                      searched: false,
                                      branch: null,
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
                                    searchedOrders,
                                    allOrdersForSearch
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

export default OrderHistories;
