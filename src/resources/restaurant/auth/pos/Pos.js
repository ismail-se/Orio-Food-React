import React, { useContext, useEffect, useState } from "react";

//functions
import {
  _t,
  currencySymbolLeft,
  formatPrice,
  currencySymbolRight,
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
// import Calculator from "awesome-react-calculator";

//importing context consumer here
import { UserContext } from "../../../../contexts/User";
import { SettingsContext } from "../../../../contexts/Settings";
import { RestaurantContext } from "../../../../contexts/Restaurant";
import { FoodContext } from "../../../../contexts/Food";

const Pos = () => {
  //getting context values here
  const {
    //common
    loading,
    setLoading,
  } = useContext(SettingsContext);

  const {
    authUserInfo,
    //customer
    customerForSearch,
    setCustomerForSearch,
    //waiter
    waiterForSearch,
    setWaiterForSearch,
  } = useContext(UserContext);

  const {
    //food
    foodForSearch,
    //food group
    foodGroupForSearch,
    //property group
    propertyGroupForSearch,
  } = useContext(FoodContext);

  const {
    //branch
    branchForSearch,
    //table
    tableForSearch,
    //dept-tag
    deptTagForSearch,
    //payment-type
    paymentTypeForSearch,
  } = useContext(RestaurantContext);

  const { t } = useTranslation();

  // State hooks here
  const [foodItem, setFoodItem] = useState({
    foodGroup: null,
    items: null,
    selectedItem: null,
    variations: null,
    properties: null,
  });

  //new order
  const [newOrder, setNewOrder] = useState(null);
  const [activeItemInOrder, setActiveItemInOrder] = useState(null);
  //checked variations
  const [selectedVariation, setSelectedVariation] = useState(null);

  //demo
  // const [newOrder, setNewOrder] = useState([
  //     {
  //       item: null,       //item id
  //       quantity: null,  //quantity
  //       variation: null, //food_with_variation_id
  //       properties: {
  //item: null, //property item id
  //quantity: null //quantity
  //},
  //     },
  //     {
  //       item: null,       //item id
  //       quantity: null,  //quantity
  //       variation: null, //food_with_variation_id
  //       properties: {
  //item: null, //property item id
  //quantity: null //quantity
  //},
  //     },
  //   ],
  // );

  //useEffect- to get data on render
  useEffect(() => {
    if (foodGroupForSearch) {
      let tempItems =
        foodForSearch &&
        foodForSearch.filter((tempItem) => {
          return parseInt(tempItem.food_group_id) === foodGroupForSearch[0].id;
        });
      // initial group & item being active here, variations, properties
      setFoodItem({
        foodGroup: foodGroupForSearch[0],
        items: tempItems,
        selectedItem: tempItems && tempItems[0],
        variations:
          tempItems && parseInt(tempItems[0].has_variation) === 1
            ? tempItems[0].variations
            : null,
        properties:
          tempItems && parseInt(tempItems[0].has_property) === 1
            ? tempItems[0].properties
            : null,
      });
    }
  }, [foodGroupForSearch, foodForSearch]);

  // {
  //   item: null,
  //   quantity: null,
  //   variation: null,
  //   properties: { item: null, quantity: null },
  // }
  const handleOrderItem = (tempFoodItem) => {
    let oldOrderItems = [];
    let newOrderItem = null;
    if (newOrder) {
      newOrder.map((eachOldOrderItem) => {
        oldOrderItems.push(eachOldOrderItem);
      });
      newOrderItem = {
        item: tempFoodItem,
        variation:
          parseInt(tempFoodItem.has_variation) === 1
            ? tempFoodItem.variations[0]
            : null,
      };
      oldOrderItems.push(newOrderItem);
    } else {
      newOrderItem = {
        item: tempFoodItem,
        variation:
          parseInt(tempFoodItem.has_variation) === 1
            ? tempFoodItem.variations[0]
            : null,
      };
      oldOrderItems.push(newOrderItem);
    }
    setNewOrder(oldOrderItems);
    setActiveItemInOrder(oldOrderItems.length - 1);
    let beep = document.getElementById("myAudio");
    beep.play();
  };

  //set order item's variation
  const handleOrderItemVariation = (tempFoodItemVariation) => {
    if (activeItemInOrder !== null) {
      if (newOrder) {
        let oldOrderItems = [];
        let newOrderItemTemp = null;
        newOrder.map((newOrderItem, index) => {
          if (index === activeItemInOrder) {
            newOrderItemTemp = {
              ...newOrderItem,
              variation: tempFoodItemVariation,
            };
            oldOrderItems.push(newOrderItemTemp);
          } else {
            newOrderItemTemp = newOrderItem;
            oldOrderItems.push(newOrderItemTemp);
          }
        });

        setNewOrder(oldOrderItems);
      }
    }
  };

  // const checkVariationSelected = (variationItem) => {
  //   let temp = [];
  //   variationChecked &&
  //     variationChecked.length > 0 &&
  //     variationChecked.map((item) => {
  //       temp.push(item);
  //     });
  //   if (!temp.includes(variationItem.food_with_variation_id)) {
  //     temp.push(variationItem.food_with_variation_id);
  //   }
  //   setVariationChecked(temp);
  // };

  return (
    <>
      <Helmet>
        <title>{_t(t("POS"))}</title>
      </Helmet>

      <audio id="myAudio">
        <source src="/assets/beep/beep.mp3" type="audio/mpeg" />
      </audio>

      {/* Menu Addons  */}
      <div className="modal fade" id="menuAddons" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header align-items-start">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  classic chicken
                </h5>
                <p className="mb-0 sm-text t-text-heading t-mb-10 fk-sm-card__description">
                  Chicken patty, cheese, special sauce, onion, tomato, lettuce
                </p>
                <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                  bdt 180.00
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="fk-sm-card__container">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    add ons
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    select up to 12
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                  optional
                </span>
              </div>
              <hr />
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <label className="mx-checkbox flex-grow-1">
                        <input
                          type="checkbox"
                          className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                        />
                        <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                          patty
                        </span>
                      </label>
                    </div>
                    <div className="col">
                      <div className="fk-qty flex-grow-1 justify-content-end">
                        <span className="fk-qty__icon fk-qty__deduct">
                          <i className="las la-minus"></i>
                        </span>
                        <input
                          type="text"
                          value="0"
                          onChange=""
                          className="fk-qty__input"
                        />
                        <span className="fk-qty__icon fk-qty__add">
                          <i className="las la-plus"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col text-right">
                      <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                        +tk 100
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="fk-sm-card__container t-mt-30">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    spice lavel
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    select up to 12
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--secondary">
                  required
                </span>
              </div>
              <hr />
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <label className="mx-checkbox flex-grow-1">
                        <input
                          type="checkbox"
                          className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                        />
                        <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                          patty
                        </span>
                      </label>
                    </div>
                    <div className="col">
                      <div className="fk-qty flex-grow-1 justify-content-end">
                        <span className="fk-qty__icon fk-qty__deduct">
                          <i className="las la-minus"></i>
                        </span>
                        <input
                          type="text"
                          value="0"
                          className="fk-qty__input"
                        />
                        <span className="fk-qty__icon fk-qty__add">
                          <i className="las la-plus"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col text-right">
                      <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                        +tk 100
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <hr />
              <div className="fk-sm-card__container t-mb-15">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    special instruction
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    please let us know if you are alergic to anything or avoid
                    anything
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                  optional
                </span>
              </div>

              <textarea
                className="form-control xsm-text"
                cols="30"
                rows="5"
                placeholder="e.g No Mayo"
              ></textarea>
            </div>
            <div className="modal-footer">
              <div className="fk-qty justify-content-end">
                <span className="fk-qty__icon fk-qty__deduct">
                  <i className="las la-minus"></i>
                </span>
                <input type="text" value="0" className="fk-qty__input" />
                <span className="fk-qty__icon fk-qty__add">
                  <i className="las la-plus"></i>
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary xsm-text text-uppercase flex-grow-1"
              >
                add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Menu Addons End */}

      {/* Show Cart  */}
      <div className="modal fade" id="showCart" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <img
                src="/assets/img/logo-alt.png"
                alt="foodkhan"
                className="img-fluid"
              />
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <span className="sm-text font-weight-bold text-uppercase font-italic">
                    token: R12548795
                  </span>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> name </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        peter parker
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> waiter </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        jhon doe
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        department{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        dine in
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        guest no.{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        05
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        table no.{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> payment </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        cash
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fk-sm-card__container t-mt-30">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    food items
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    properties & bill
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                  total
                </span>
              </div>
              <hr />
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <span className="t-text-heading sm-text text-capitalize">
                        chicken burger
                      </span>
                    </div>
                    <div className="col">
                      <div className="fk-qty flex-grow-1 justify-content-end">
                        <span className="fk-qty__icon fk-qty__deduct">
                          <i className="las la-minus"></i>
                        </span>
                        <input
                          type="text"
                          value="0"
                          className="fk-qty__input"
                        />
                        <span className="fk-qty__icon fk-qty__add">
                          <i className="las la-plus"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col text-right">
                      <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                        +tk 100
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <hr />
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        sub total{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        1800.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        TAX (15%){" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        80.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> service </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        20.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        discount{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        100.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        total bill
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        2000.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-primary w-100 xsm-text text-uppercase"
                  >
                    settle
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-success w-100 xsm-text text-uppercase"
                  >
                    submit
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="fk-qty justify-content-end">
                <span className="fk-qty__icon fk-qty__deduct">
                  <i className="las la-minus"></i>
                </span>
                <input type="text" value="0" className="fk-qty__input" />
                <span className="fk-qty__icon fk-qty__add">
                  <i className="las la-plus"></i>
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary xsm-text text-uppercase flex-grow-1"
              >
                place order
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Show Cart End */}

      {/* Extra Info  */}
      <div className="modal fade" id="extraInfo" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
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
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">
                      Select Customer
                    </option>
                    <option value="1">Shoanur Rahman (0123456789)</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Table">Select Table</option>
                    <option value="1">Table 1</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">
                      Select Waiter
                    </option>
                    <option value="1">Shoanur Rahman</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">
                      Department Tag
                    </option>
                    <option value="1">Dine In</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">Payment Type</option>
                    <option value="1">Master Card</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  {/* Example single danger button  */}
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className="btn sm-text text-uppercase w-100 btn-outline-danger dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      total guest
                    </button>
                    <ul className="dropdown-menu w-100 border-0">
                      <li>
                        <input
                          type="number"
                          className="form-control sm-text"
                          placeholder="Total guest.."
                        />
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Extra Info End */}

      <main id="main" data-simplebar>
        {/* Mobile Screen Only   */}
        <div className="d-md-none">
          <div className="fk-sm-card t-mt-10" id="card-1">
            <h3 className="mt-0 t-mb-30 text-capitalize">chicken burger</h3>
            <ul className="t-list fk-sm-card-list">
              <li
                className="fk-sm-card-list__item"
                data-toggle="modal"
                data-target="#menuAddons"
              >
                <div className="fk-sm-card__container">
                  <div className="fk-sm-card__content">
                    <h6 className="text-capitalize fk-sm-card__title">
                      classic chicken
                    </h6>
                    <p className="mb-0 sm-text t-text-dark--light-40 t-mb-10 fk-sm-card__description">
                      Chicken patty, cheese, special sauce, onion, tomato,
                      lettuce
                    </p>
                    <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                      bdt 180.00
                    </p>
                  </div>
                  <div className="fk-sm-card__action">
                    <div className="fk-sm-card__img fk-sm-card__img--1"></div>
                    <div className="fk-sm-card__cart">
                      <i className="las la-plus"></i>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="fk-sm-card t-mt-10 t-mb-10" id="card-2">
            <h3 className="mt-0 t-mb-30 text-capitalize">beef burger</h3>
            <ul className="t-list fk-sm-card-list">
              <li
                className="fk-sm-card-list__item"
                data-toggle="modal"
                data-target="#menuAddons"
              >
                <div className="fk-sm-card__container">
                  <div className="fk-sm-card__content">
                    <h6 className="text-capitalize fk-sm-card__title">
                      classic beef
                    </h6>
                    <p className="mb-0 sm-text t-text-dark--light-40 t-mb-10 fk-sm-card__description">
                      beef patty, cheese, special sauce, onion, tomato, lettuce
                    </p>
                    <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                      bdt 180.00
                    </p>
                  </div>
                  <div className="fk-sm-card__action">
                    <div className="fk-sm-card__img fk-sm-card__img--11"></div>
                    <div className="fk-sm-card__cart">
                      <i className="las la-plus"></i>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="fk-sm-footnav">
            <div
              className="fk-sm-footnav__cart bg-primary"
              data-toggle="modal"
              data-target="#showCart"
            >
              <ul className="t-list fk-sm-nav__bar justify-content-between">
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link text-light">
                    {" "}
                    1{" "}
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link text-light">
                    view cart
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link text-light">
                    tk 280
                  </a>
                </li>
              </ul>
            </div>
            <div className="fk-sm-footnav__order bg-primary">
              <ul className="t-list fk-sm-nav__bar justify-content-center">
                <li className="fk-sm-nav__list">
                  <a
                    href="#"
                    className="t-link fk-sm-nav__link text-light"
                    data-toggle="modal"
                    data-target="#extraInfo"
                  >
                    additional information
                  </a>
                </li>
              </ul>
            </div>
            <div className="fk-sm-footnav__container">
              <ul className="t-list fk-sm-footnav__list justify-content-between">
                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-concierge-bell"></i>
                  </a>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-file-invoice-dollar"></i>
                  </a>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <a
                    href="#"
                    className="t-link fk-sm-footnav__link text-danger"
                  >
                    <i className="las la-plus-circle"></i>
                  </a>
                </li>

                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-search"></i>
                  </a>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-print"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Mobile Screen Only   */}

        {/* Show In Tab   */}
        <div className="fk-main d-none d-md-block t-mt-10">
          <div className="container-fluid">
            <div className="row gx-2">
              {/* Left Side  */}
              <div className="col-md-7">
                <div className="row gx-2 align-items-center">
                  <div className="col-md-9 col-lg-7 col-xl-6 col-xxl-5">
                    <div className="row align-items-center gx-2">
                      <div className="col">
                        <a
                          href="order-history.html"
                          className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-primary xsm-text text-uppercase text-center w-100"
                        >
                          all order
                        </a>
                      </div>
                      <div className="col">
                        <a
                          href="order-today.html"
                          className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-secondary xsm-text text-uppercase text-center w-100"
                        >
                          current
                        </a>
                      </div>
                      <div className="col">
                        <a
                          href="order-page.html"
                          className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-info xsm-text text-uppercase text-center w-100"
                        >
                          new order
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-5 col-xl-6 col-xxl-7">
                    <div className="input-group">
                      <div className="form-file">
                        <input
                          type="text"
                          className="form-control border-0 form-control--light-2 rounded-0"
                          placeholder="Please Search Food"
                        />
                      </div>
                      <button className="btn btn-primary" type="button">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row t-mt-10 gx-2">
                  {/* Left Menu   */}
                  <div className="col-md-4 col-xl-3">
                    <div className="fk-scroll--pos-menu" data-simplebar>
                      <ul className="t-list fk-pos-nav list-group">
                        {/* Food groups */}
                        {foodGroupForSearch &&
                          foodGroupForSearch.map((groupItem, groupIndex) => {
                            return (
                              <li className="fk-pos-nav__list" key={groupIndex}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    // set active group, group items, initial item active, todo:: set variations and properties
                                    let tempItems =
                                      foodForSearch &&
                                      foodForSearch.filter((tempItem) => {
                                        return (
                                          parseInt(tempItem.food_group_id) ===
                                          groupItem.id
                                        );
                                      });
                                    setFoodItem({
                                      ...foodItem,
                                      foodGroup: groupItem,
                                      items: tempItems,
                                      selectedItem: tempItems && tempItems[0],
                                      variations:
                                        tempItems &&
                                        parseInt(tempItems[0].has_variation) ===
                                          1
                                          ? tempItems[0].variations
                                          : null,
                                      properties:
                                        tempItems &&
                                        parseInt(tempItems[0].has_property) ===
                                          1
                                          ? tempItems[0].properties
                                          : null,
                                    });
                                  }}
                                  //set active or !
                                  className={`w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase ${
                                    foodItem.foodGroup &&
                                    foodItem.foodGroup.id === groupItem.id &&
                                    "active"
                                  }`}
                                >
                                  {groupItem.name}
                                </button>
                              </li>
                            );
                          })}
                        {/* Food groups */}
                      </ul>
                    </div>
                  </div>
                  {/* Left Menu  End */}

                  {/* Dish Addons   */}
                  <div className="col-md-8 col-xl-9">
                    <div className="">
                      <div className="active" id="nav-1">
                        <div className="row gx-1">
                          <div className="col-xl-6 col-xxl-5 order-xl-2">
                            <div className="tab-content t-mb-10 mb-xl-0">
                              <div className="" id="addons-1">
                                <div className="t-bg-white">
                                  <div
                                    className="fk-addons-variation"
                                    data-simplebar
                                  >
                                    {/* Variations */}
                                    <div className="fk-addons-table">
                                      <div className="fk-addons-table__head text-center">
                                        variations
                                      </div>
                                      {foodItem.variations ? (
                                        <>
                                          <div className="fk-addons-table__info">
                                            <div className="row g-0">
                                              <div className="col-8 pl-3 border-right">
                                                <span className="fk-addons-table__info-text text-capitalize">
                                                  name
                                                </span>
                                              </div>
                                              <div className="col-4 text-center">
                                                <span className="fk-addons-table__info-text text-capitalize">
                                                  price
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="fk-addons-table__body">
                                            {foodItem.variations.map(
                                              (variationItem) => {
                                                return (
                                                  <div className="fk-addons-table__body-row">
                                                    <div className="row g-0">
                                                      <div
                                                        className="col-8 border-right t-pl-10 t-pr-10"
                                                        onClick={() => {
                                                          handleOrderItemVariation(
                                                            variationItem
                                                          );
                                                        }}
                                                      >
                                                        <label className="mx-checkbox">
                                                          <input
                                                            type="radio"
                                                            className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                                            name="variation"
                                                            // checked={
                                                            //   variationChecked &&
                                                            //   variationChecked.includes(
                                                            //     variationItem.food_with_variation_id
                                                            //   )
                                                            // }
                                                          />
                                                          <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8 fk-addons-table__body-text">
                                                            {
                                                              variationItem.variation_name
                                                            }
                                                          </span>
                                                        </label>
                                                      </div>
                                                      <div className="col-4 text-center">
                                                        <span className="fk-addons-table__body-text sm-text">
                                                          {currencySymbolLeft()}
                                                          {formatPrice(
                                                            variationItem.food_with_variation_price
                                                          )}
                                                          {currencySymbolRight()}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="fk-addons-table__info py-4">
                                          <div className="row g-0">
                                            <div className="col-12 text-center border-right">
                                              <span className="fk-addons-table__info-text text-capitalize text-primary">
                                                No variations
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {/* Variations end*/}

                                    <div
                                      className={
                                        foodItem.properties ? "" : "d-none"
                                      }
                                    >
                                      {/* Property group and items */}
                                      {foodItem.properties && (
                                        <>
                                          {foodItem.properties.map(
                                            (propertyItem) => {
                                              //property group
                                              let selectedGroup =
                                                propertyGroupForSearch &&
                                                propertyGroupForSearch.find(
                                                  (singlePropertyGroup) => {
                                                    return (
                                                      singlePropertyGroup.id ===
                                                      propertyItem[0]
                                                        .property_group_id
                                                    );
                                                  }
                                                );
                                              return (
                                                <div className="fk-addons-table">
                                                  <div className="fk-addons-table__head text-center">
                                                    {selectedGroup &&
                                                      selectedGroup.name}
                                                  </div>
                                                  <div className="fk-addons-table__info">
                                                    <div className="row g-0">
                                                      <div className="col-5 pl-3 border-right">
                                                        <span className="fk-addons-table__info-text text-capitalize">
                                                          name
                                                        </span>
                                                      </div>
                                                      <div className="col-3 text-center border-right">
                                                        <span className="fk-addons-table__info-text text-capitalize">
                                                          QTY
                                                        </span>
                                                      </div>
                                                      <div className="col-4 text-center">
                                                        <span className="fk-addons-table__info-text text-capitalize">
                                                          price
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="fk-addons-table__body">
                                                    {propertyItem.map(
                                                      (eachItem) => {
                                                        return (
                                                          <div className="fk-addons-table__body-row">
                                                            <div className="row g-0">
                                                              <div className="col-5 border-right t-pl-10 t-pr-10">
                                                                <label className="mx-checkbox">
                                                                  <input
                                                                    type="checkbox"
                                                                    className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                                                  />
                                                                  <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8 fk-addons-table__body-text">
                                                                    {
                                                                      eachItem.name
                                                                    }
                                                                  </span>
                                                                </label>
                                                              </div>
                                                              <div className="col-3 text-center border-right">
                                                                <div className="fk-qty justify-content-center t-pt-10 t-pb-10">
                                                                  <span className="fk-qty__icon fk-qty__deduct">
                                                                    <i className="las la-minus"></i>
                                                                  </span>
                                                                  <input
                                                                    type="text"
                                                                    value="0"
                                                                    className="fk-qty__input t-bg-clear"
                                                                  />
                                                                  <span className="fk-qty__icon fk-qty__add">
                                                                    <i className="las la-plus"></i>
                                                                  </span>
                                                                </div>
                                                              </div>
                                                              <div className="col-4 text-center">
                                                                <span className="fk-addons-table__body-text sm-text">
                                                                  {currencySymbolLeft()}
                                                                  {formatPrice(
                                                                    eachItem.extra_price
                                                                  )}
                                                                  {currencySymbolRight()}
                                                                </span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </>
                                      )}
                                    </div>
                                    {/* Property group and items */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-6 col-xxl-7 order-xl-1">
                            <div className="fk-dish--scroll" data-simplebar>
                              <div className="list-group fk-dish row gx-2">
                                {foodItem.items &&
                                  foodItem.items.map(
                                    (tempFoodItem, tempFoodItemIndex) => {
                                      return (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            // set variations, properties and selected items here
                                            setFoodItem({
                                              ...foodItem,
                                              selectedItem: tempFoodItem,
                                              variations:
                                                tempFoodItem &&
                                                parseInt(
                                                  tempFoodItem.has_variation
                                                ) === 1
                                                  ? tempFoodItem.variations
                                                  : null,
                                              properties:
                                                tempFoodItem &&
                                                parseInt(
                                                  tempFoodItem.has_property
                                                ) === 1
                                                  ? tempFoodItem.properties
                                                  : null,
                                            });
                                            handleOrderItem(tempFoodItem);
                                          }}
                                          className={`fk-dish__link t-mb-10 col-md-6 col-lg-4 col-xl-6 col-xxl-4 t-link border-0 ${
                                            foodItem.selectedItem &&
                                            foodItem.selectedItem.id ===
                                              tempFoodItem.id &&
                                            "active"
                                          }`}
                                        >
                                          <div className="fk-dish-card">
                                            <div className="fk-dish-card__img">
                                              <img
                                                src={tempFoodItem.image}
                                                alt="foodkhan"
                                                className="img-fluid m-auto"
                                              />
                                            </div>
                                            <span className="fk-dish-card__title text-center text-uppercase">
                                              {tempFoodItem.name}
                                            </span>
                                          </div>
                                        </button>
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
                  {/* Dish Addons  End */}
                </div>
              </div>
              {/* Left Side End */}

              {/* Right Side  */}
              <div className="col-md-5">
                <div className="row gx-2">
                  <div className="col-md-4 col-xl-3">
                    <div className="fk-right-nav">
                      <div className="row flex-column justify-content-between h-100">
                        <div className="col-12 flex-grow-1">
                          <div className="fk-right-nav__scroll" data-simplebar>
                            <ul className="t-list addons-list">
                              <li className="addons-list__item mt-1 mx-1">
                                <Select
                                  options={
                                    customerForSearch && customerForSearch
                                  }
                                  components={makeAnimated()}
                                  getOptionLabel={(option) =>
                                    option.name + " (" + option.phn_no + ")"
                                  }
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Customer")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                <Select
                                  options={tableForSearch && tableForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Table")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                <Select
                                  options={waiterForSearch && waiterForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Waiter")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                <Select
                                  options={deptTagForSearch && deptTagForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Dept tag")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1 payment-type-parent">
                                <Select
                                  options={
                                    paymentTypeForSearch && paymentTypeForSearch
                                  }
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  isMulti
                                  clearIndicator={null}
                                  placeholder={_t(t("Payment type")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                {/* Example single danger button  */}
                                <div className="btn-group w-100 xsm-text">
                                  <button
                                    type="button"
                                    className="fk-right-nav__guest-btn btn text-uppercase w-100 t-bg-white dropdown-toggle xsm-text"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    total guest
                                  </button>
                                  <ul className="dropdown-menu w-100 border-0 xsm-text">
                                    <li>
                                      <input
                                        type="number"
                                        className="form-control xsm-text"
                                        placeholder="Total guest.."
                                      />
                                    </li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 t-mb-10">
                              <a
                                className="w-100 t-heading-font btn btn-outline-danger font-weight-bold text-uppercase sm-text"
                                href="#"
                              >
                                print bill
                              </a>
                            </div>
                            <div className="col-12">
                              <a
                                className="w-100 t-heading-font btn btn-primary font-weight-bold text-uppercase sm-text"
                                href="#"
                              >
                                cancel
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 col-xl-9">
                    <div className="fk-right-nav p-2 p-xl-3 t-bg-white">
                      {/* Disply Only Small Screen   */}
                      <div className="h-100 w-100 d-xl-none" data-simplebar>
                        <div className="fk-receipt-content">
                          <div className="fk-receipt-header align-items-center">
                            <img
                              src="/assets/img/logo-alt.png"
                              alt="foodkhan"
                              className="img-fluid"
                            />
                          </div>
                          <div className="fk-receipt-body t-mt-10">
                            <div className="row g-0">
                              <div className="col-12">
                                <span className="sm-text font-weight-bold text-uppercase font-italic">
                                  token: R12548795
                                </span>
                              </div>
                              <div className="col-12">
                                <div className="row g-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      name
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      peter parker
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      waiter
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      jhon doe
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      department
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      dine in
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      guest no.
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      05
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      table no.
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      10
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      payment
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      cash
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="fk-sm-card__container t-mt-30">
                              <div className="fk-sm-card__content">
                                <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                                  food items
                                </h6>
                                <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                                  properties & bill
                                </p>
                              </div>
                              <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                                total
                              </span>
                            </div>
                            <hr />
                            <ul className="t-list addons-list">
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      chicken burger
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      beef burger
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 230
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      pizza
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      pasta
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      patty
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      sandwich
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      bun
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      soup
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      drinks
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                            <hr />
                            <div className="row">
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      sub total
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      1800.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      TAX (15%)
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      80.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      service
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      20.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      discount
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      100.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      total bill
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      2000.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-6">
                                <button
                                  type="button"
                                  className="btn btn-primary w-100 xsm-text text-uppercase"
                                >
                                  settle
                                </button>
                              </div>
                              <div className="col-6">
                                <button
                                  type="button"
                                  className="btn btn-success w-100 xsm-text text-uppercase"
                                >
                                  submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Disply Only Small Screen End  */}

                      {/* Display Only Large Screen   */}
                      <div className="h-100 w-100 d-none d-xl-block">
                        <div className="fk-price-table">
                          <div className="fk-price-table__head">
                            <div className="row gx-0 align-items-center">
                              <div className="col-6">
                                <span className="d-block sm-text font-weight-bold text-uppercase font-italic">
                                  token: R12548795
                                </span>
                              </div>
                              <div className="col-6 text-right">
                                <span className="d-block xsm-text text-uppercase">
                                  10/15/2020
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="fk-price-table__body t-mt-10">
                            <div className="fk-price-table__body-top">
                              <div className="fk-table">
                                <div className="fk-table__head">
                                  <div className="row g-0 border">
                                    <div className="col-7 text-center border-right">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        food item
                                      </span>
                                    </div>
                                    <div className="col-2 text-center border-right">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        QTY
                                      </span>
                                    </div>
                                    <div className="col-3 text-center border-right">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        price
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="fk-table__body border-bottom"
                                  data-simplebar
                                >
                                  <div className="sky-is-blue">
                                    {newOrder && newOrder.length > 0 ? (
                                      newOrder.map(
                                        (orderListItem, orderListItemIndex) => {
                                          return (
                                            <div
                                              className={`fk-table-container-order ${
                                                orderListItemIndex ===
                                                  activeItemInOrder && "active"
                                              }`}
                                              onClick={() => {
                                                //orderListItem's group wise all items
                                                let tempItems =
                                                  foodForSearch &&
                                                  foodForSearch.filter(
                                                    (tempItem) => {
                                                      return (
                                                        tempItem.food_group_id ===
                                                        orderListItem.item
                                                          .food_group_id
                                                      );
                                                    }
                                                  );

                                                //orderListItem's group
                                                let foodGroup =
                                                  foodGroupForSearch &&
                                                  foodGroupForSearch.find(
                                                    (groupItem) => {
                                                      return (
                                                        groupItem.id ===
                                                        parseInt(
                                                          orderListItem.item
                                                            .food_group_id
                                                        )
                                                      );
                                                    }
                                                  );

                                                // selected pos item
                                                let selectedItemTemp =
                                                  tempItems &&
                                                  tempItems.find(
                                                    (tempSelectedItem) => {
                                                      return (
                                                        tempSelectedItem.id ===
                                                        orderListItem.item.id
                                                      );
                                                    }
                                                  );

                                                // Set variations, properties, selected item
                                                setFoodItem({
                                                  ...foodItem,
                                                  foodGroup: foodGroup,
                                                  items: tempItems,
                                                  selectedItem: selectedItemTemp,
                                                  variations:
                                                    selectedItemTemp &&
                                                    parseInt(
                                                      selectedItemTemp.has_variation
                                                    ) === 1
                                                      ? selectedItemTemp.variations
                                                      : null,
                                                  properties:
                                                    selectedItemTemp &&
                                                    parseInt(
                                                      selectedItemTemp.has_property
                                                    ) === 1
                                                      ? selectedItemTemp.properties
                                                      : null,
                                                });

                                                //set active order list index for background color of selected
                                                setActiveItemInOrder(
                                                  orderListItemIndex
                                                );
                                              }}
                                            >
                                              <div className="row g-0 border border-top-0">
                                                <div className="col-7 border-right">
                                                  <div className="d-flex justify-content-between">
                                                    <span className="text-capitalize d-block t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold t-mr-8">
                                                      {orderListItem.item.name}
                                                    </span>
                                                    <span className="text-capitalize d-block t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold">
                                                      <span className="badge rounded-pill bg-secondary text-capitalize">
                                                        remove
                                                      </span>
                                                    </span>
                                                  </div>
                                                  <div className="row g-0">
                                                    {parseInt(
                                                      orderListItem.item
                                                        .has_variation
                                                    ) === 1 && (
                                                      <div className="col-12">
                                                        <div className="row g-2">
                                                          <div className="col-5 col-xxl-4">
                                                            <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                              variation :
                                                            </span>
                                                          </div>
                                                          <div className="col-7 col-xxl-8">
                                                            <span className="text-capitalize sm-text d-inline-block">
                                                              {orderListItem.variation
                                                                ? orderListItem
                                                                    .variation
                                                                    .variation_name
                                                                : "-"}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                    <div className="col-12">
                                                      <div className="row g-2">
                                                        <div className="col-5 col-xxl-4">
                                                          <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                            addons :
                                                          </span>
                                                        </div>
                                                        <div className="col-7 col-xxl-8">
                                                          <span className="text-capitalize sm-text d-inline-block">
                                                            addons, variations,
                                                            aan
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-2 text-center border-right d-flex justify-content-center align-items-center">
                                                  <div className="fk-qty t-pt-5 t-pb-5 justify-content-center">
                                                    <span className="fk-qty__icon fk-qty__deduct">
                                                      <i className="las la-minus"></i>
                                                    </span>
                                                    <input
                                                      type="text"
                                                      value="0"
                                                      className="fk-qty__input t-bg-clear"
                                                    />
                                                    <span className="fk-qty__icon fk-qty__add">
                                                      <i className="las la-plus"></i>
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="col-3 text-center border-right d-flex justify-content-center align-items-center">
                                                  <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                                    {parseInt(
                                                      orderListItem.item
                                                        .has_variation
                                                    ) === 1 ? (
                                                      <>
                                                        {currencySymbolLeft()}
                                                        {formatPrice(
                                                          orderListItem
                                                            .variation
                                                            .food_with_variation_price
                                                        )}
                                                        {currencySymbolRight()}
                                                      </>
                                                    ) : (
                                                      <>
                                                        {currencySymbolLeft()}
                                                        {formatPrice(
                                                          orderListItem.item
                                                            .price
                                                        )}
                                                        {currencySymbolRight()}
                                                      </>
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )
                                    ) : (
                                      <div className="text-primary text-center pt-5 xsm-text text-uppercase">
                                        Select food item to add to the list
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="fk-price-table__body-bottom t-mt-10">
                              <div className="fk-table__head">
                                <div className="row g-0 border">
                                  <div className="col-6 text-center border-right">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          sub total
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          1879.00
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-uppercase xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          tax (15%)
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          109.00
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-0 border">
                                  <div className="col-6 text-center border-right">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          service charge
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <input
                                          type="text"
                                          className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center"
                                          value="0"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          discount
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <input
                                          type="text"
                                          className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center"
                                          value="0"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="t-bg-epsilon t-pl-10 t-pr-10">
                                <div className="row">
                                  <div className="col-6">
                                    <span className="text-capitalize font-weight-bold text-light d-block t-pt-8 t-pb-10">
                                      total bill
                                    </span>
                                  </div>
                                  <div className="col-6 text-right">
                                    <span className="text-capitalize font-weight-bold text-light d-block t-pt-8 t-pb-10">
                                      5000.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="t-bg-light-2 t-pr-10">
                                <div className="row gx-2 align-items-center">
                                  <div className="col-6">
                                    <input
                                      type="text"
                                      className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center fk-paid-input"
                                      placeholder="Insert Paid amount"
                                    />
                                  </div>
                                  <div className="col-6 text-right">
                                    <div className="row gx-2 align-items-center">
                                      <div className="col-6 text-left">
                                        <span className="text-capitalize font-weight-bold d-block">
                                          payable
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="text-capitalize font-weight-bold d-block">
                                          400.00
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row g-0 align-items-center t-mt-10">
                                <div className="col-4">
                                  <div className="t-mr-8">
                                    <div className="fk-calculator-container">
                                      <button
                                        type="button"
                                        className="btn btn-info text-uppercase fk-calculator-toggle"
                                      >
                                        <i className="fa fa-calculator"></i>
                                      </button>
                                      <div className="calculator">
                                        <div className="input" id="input"></div>
                                        <div className="buttons">
                                          <div className="operators">
                                            <div>+</div>
                                            <div>-</div>
                                            <div>&times;</div>
                                            <div>&divide;</div>
                                          </div>
                                          <div className="leftPanel">
                                            <div className="numbers">
                                              <div>7</div>
                                              <div>8</div>
                                              <div>9</div>
                                            </div>
                                            <div className="numbers">
                                              <div>4</div>
                                              <div>5</div>
                                              <div>6</div>
                                            </div>
                                            <div className="numbers">
                                              <div>1</div>
                                              <div>2</div>
                                              <div>3</div>
                                            </div>
                                            <div className="numbers">
                                              <div>0</div>
                                              <div>.</div>
                                              <div id="clear">C</div>
                                            </div>
                                          </div>
                                          <div className="equal" id="result">
                                            =
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-8">
                                  <div className="d-flex justify-content-end align-items-center">
                                    <div className="t-mr-8">
                                      <button
                                        type="button"
                                        className="btn btn-primary sm-text text-uppercase font-weight-bold"
                                      >
                                        settle
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        className="btn btn-success sm-text text-uppercase font-weight-bold"
                                      >
                                        submit
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Display Only Large Screen End  */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Side End */}
            </div>
          </div>
        </div>
        {/* Show In Tab   */}
      </main>
    </>
  );
};

export default Pos;
