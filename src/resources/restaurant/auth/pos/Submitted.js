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

const Submitted = () => {
  //getting context values here
  const {
    //common
    loading,
    setLoading,
  } = useContext(SettingsContext);

  const {
    //submitted orders
    submittedOrders,
    setPaginatedSubmittedOrders,
    submittedOrdersForSearch,

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

  //payment type
  const handleSetpaymentType = (payment_type) => {
    setCheckOrderDetails({
      ...checkOrderDetails,
      payment_type,
    });

    //calculate paid amount to set return amount
    handleCalculatePaid(checkOrderDetails.payment_amount, payment_type);
  };

  //payment type amount
  const handlePaymentTypeAmount = (e) => {
    let tempPaymentAmount = {
      ...checkOrderDetails.payment_amount,
      [e.target.name]: e.target.value,
    };

    setCheckOrderDetails({
      ...checkOrderDetails,
      payment_amount: tempPaymentAmount,
    });

    //calculate paid amount to set return amount
    handleCalculatePaid(tempPaymentAmount, checkOrderDetails.payment_type);
  };

  //calculate paid amount
  const handleCalculatePaid = (paymentAmount, paymentType) => {
    let paidAmount = 0;
    if (paymentAmount !== null && paymentType !== null) {
      let thePaymentArray = [];
      if (paymentAmount) {
        thePaymentArray = Object.entries(paymentAmount);
      }
      thePaymentArray.map((eachPaymentItem) => {
        let thePaymentType = paymentType.find((paymentTypeItem) => {
          return paymentTypeItem.id === parseInt(eachPaymentItem[0]);
        });
        if (eachPaymentItem[1] !== "") {
          if (
            thePaymentType &&
            thePaymentType.id === parseInt(eachPaymentItem[0])
          ) {
            paidAmount = paidAmount + parseFloat(eachPaymentItem[1]);
          }
        }
      });
      let localCurrency = JSON.parse(localStorage.getItem("currency"));
      paidAmount = paidAmount / localCurrency.rate;
      let theReturnMoney = 0;
      if (checkOrderDetails.item) {
        theReturnMoney =
          paidAmount - parseFloat(checkOrderDetails.item.total_payable);
      }
      setReturnMoneyUsd(theReturnMoney);
    } else {
      setReturnMoneyUsd(0);
    }
    setPaidMoney(paidAmount);
  };

  // handleSettleOrder
  const handleSettleOrder = (e) => {
    e.preventDefault();
    if (
      paidMoney <
      parseFloat(
        checkOrderDetails.item.total_payable -
          checkOrderDetails.item.paid_amount
      )
    ) {
      toast.error(
        `${_t(
          t("Please enter paid amount atleast equal to the total due amount")
        )}`,
        {
          position: "bottom-center",
          closeButton: false,
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        }
      );
    } else {
      handleSettleOrderAxiosReq();
    }
  };

  //settle order server request
  const handleSettleOrderAxiosReq = () => {
    let url = BASE_URL + "/settings/settle-submitted-order";
    let localCurrency = JSON.parse(localStorage.getItem("currency"));
    let formData = {
      order_group_id: checkOrderDetails.item.id,
      payment_type: checkOrderDetails.payment_type,
      payment_amount: checkOrderDetails.payment_amount,
      paidMoney: paidMoney,
      localCurrency: localCurrency,
    };
    setLoading(true);
    axios
      .post(url, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        if (res.data !== "paymentIssue") {
          console.log(res.data);
          setCheckOrderDetails({
            ...checkOrderDetails,
            item: res.data[2],
            payment_type: null,
            payment_amount: null,
            settle: false,
          });
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            `${_t(
              t(
                "Please enter paid amount atleast equal to the total due amount"
              )
            )}`,
            {
              position: "bottom-center",
              closeButton: false,
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              className: "text-center toast-notification",
            }
          );
        }
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
      setSearchedOrder({ ...searchedOrder, searched: false });
    } else {
      let searchedList = submittedOrdersForSearch.filter((item) => {
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

  //cancel order confirmation modal
  const handleCancelOrderConfirmation = (orderGroup) => {
    console.log(orderGroup);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="card card-body">
            <h1>{_t(t("Are you sure?"))}</h1>
            <p className="text-center">
              {_t(t("You want to cancel this order?"))}
            </p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCancelOrder(orderGroup);
                  onClose();
                }}
              >
                {_t(t("Yes, cancel it!"))}
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
  const handleCancelOrder = (orderGroup) => {
    if (orderGroup.is_accepted === 0) {
      let url = BASE_URL + "/settings/cancel-submitted-order";
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
    } else {
      toast.error(
        `${_t(t("Can not cancel this order, this is being cooked"))}`,
        {
          position: "bottom-center",
          closeButton: false,
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        }
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{_t(t("Submitted orders"))}</title>
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
                  <div className="text-center bg-success text-white py-2">
                    {_t(t("Order has been settled, you can close this now"))}
                  </div>
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
                  <div className="my-2 payment-type-parent">
                    <Select
                      options={paymentTypeForSearch && paymentTypeForSearch}
                      components={makeAnimated()}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.name}
                      classNamePrefix="select"
                      className="xsm-text"
                      onChange={handleSetpaymentType}
                      maxMenuHeight="200px"
                      isMulti
                      clearIndicator={null}
                      placeholder={_t(t("Select payment methods")) + ".."}
                    />
                    {checkOrderDetails.payment_type !== null && (
                      <form
                        className="border my-2 change-background rounded-lg"
                        onSubmit={handleSettleOrder}
                      >
                        <div className="sm-text text-center text-white py-2">
                          Amount
                        </div>
                        {checkOrderDetails.payment_type.map(
                          (eachPaymentType, paymentTypeIndex) => {
                            return (
                              <div className="addons-list__item mx-2 mb-1">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  name={eachPaymentType.id}
                                  autoComplete="off"
                                  className="form-control xsm-text pl-2"
                                  onChange={handlePaymentTypeAmount}
                                  placeholder={eachPaymentType.name}
                                  value={
                                    checkOrderDetails.payment_amount &&
                                    checkOrderDetails.payment_amount[
                                      eachPaymentType.id
                                    ]
                                  }
                                />
                              </div>
                            );
                          }
                        )}
                        <div className="pb-2 pl-2 my-2">
                          <button
                            className="btn btn-sm btn-warning text-dark px-3 text-uppercase"
                            type="submit"
                          >
                            Settle order
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
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

                                              <td className="xsm-text align-middle text-center">
                                                {item.is_cancelled === 0 ? (
                                                  <div className="dropdown text-capitalize">
                                                    <button
                                                      className="btn t-bg-clear t-text-dark--light-40"
                                                      type="button"
                                                      data-toggle="dropdown"
                                                    >
                                                      <i className="fa fa-ellipsis-h"></i>
                                                    </button>
                                                    <div className="dropdown-menu">
                                                      <NavLink
                                                        // send state- order group id
                                                        to="/dashboard/pos/edit-order"
                                                        className="dropdown-item sm-text text-capitalize"
                                                      >
                                                        <span className="t-mr-8">
                                                          <i className="fa fa-pencil"></i>
                                                        </span>
                                                        {_t(t("Edit"))}
                                                      </NavLink>

                                                      <button
                                                        // send state- order group id
                                                        className="dropdown-item sm-text text-capitalize"
                                                        onClick={() => {
                                                          setCheckOrderDetails({
                                                            ...checkOrderDetails,
                                                            item: item,
                                                            settle: true,
                                                            payment_amount: null,
                                                            payment_type: null,
                                                          });
                                                          setReturnMoneyUsd(0);
                                                          setPaidMoney(0);
                                                        }}
                                                        data-toggle="modal"
                                                        data-target="#orderDetails"
                                                      >
                                                        <span className="t-mr-8">
                                                          <i className="fa fa-refresh"></i>
                                                        </span>
                                                        {_t(t("Settle order"))}
                                                      </button>

                                                      {item.is_ready !== 1 && [
                                                        item.is_accepted ===
                                                        0 ? (
                                                          <button
                                                            className="dropdown-item sm-text text-capitalize"
                                                            onClick={() => {
                                                              handleCancelOrderConfirmation(
                                                                item
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
                                                              <i className="fa fa-trash"></i>
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

                                            <td className="xsm-text align-middle text-center">
                                              {item.is_cancelled === 0 ? (
                                                <div className="dropdown text-capitalize">
                                                  <button
                                                    className="btn t-bg-clear t-text-dark--light-40"
                                                    type="button"
                                                    data-toggle="dropdown"
                                                  >
                                                    <i className="fa fa-ellipsis-h"></i>
                                                  </button>
                                                  <div className="dropdown-menu">
                                                    <NavLink
                                                      // send state- order group id
                                                      to="/dashboard/pos/edit-order"
                                                      className="dropdown-item sm-text text-capitalize"
                                                    >
                                                      <span className="t-mr-8">
                                                        <i className="fa fa-pencil"></i>
                                                      </span>
                                                      {_t(t("Edit"))}
                                                    </NavLink>

                                                    <button
                                                      // send state- order group id
                                                      className="dropdown-item sm-text text-capitalize"
                                                      onClick={() => {
                                                        setCheckOrderDetails({
                                                          ...checkOrderDetails,
                                                          item: item,
                                                          settle: true,
                                                          payment_amount: null,
                                                          payment_type: null,
                                                        });
                                                        setReturnMoneyUsd(0);
                                                        setPaidMoney(0);
                                                      }}
                                                      data-toggle="modal"
                                                      data-target="#orderDetails"
                                                    >
                                                      <span className="t-mr-8">
                                                        <i className="fa fa-refresh"></i>
                                                      </span>
                                                      {_t(t("Settle order"))}
                                                    </button>

                                                    {item.is_ready !== 1 && [
                                                      item.is_accepted === 0 ? (
                                                        <button
                                                          className="dropdown-item sm-text text-capitalize"
                                                          onClick={() => {
                                                            handleCancelOrderConfirmation(
                                                              item
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
                                                            <i className="fa fa-trash"></i>
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
