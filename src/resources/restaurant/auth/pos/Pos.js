import React from "react";
import { Helmet } from "react-helmet";

//functions
import { _t } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

const Pos = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{_t(t("POS"))}</title>
      </Helmet>

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
                        <li className="fk-pos-nav__list">
                          <a
                            className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase active"
                            href="#nav-1"
                            data-toggle="list"
                          >
                            fried chicken
                          </a>
                        </li>
                        <li className="fk-pos-nav__list">
                          <a
                            className="w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase"
                            href="#nav-2"
                            data-toggle="list"
                          >
                            curry
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Left Menu  End */}

                  {/* Dish Addons   */}
                  <div className="col-md-8 col-xl-9">
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="nav-1">
                        <div className="row gx-1">
                          <div className="col-xl-6 col-xxl-5 order-xl-2">
                            <div className="tab-content t-mb-10 mb-xl-0">
                              <div
                                className="tab-pane fade show active"
                                id="addons-1"
                              >
                                <div className="t-bg-white">
                                  <div
                                    className="fk-addons-variation"
                                    data-simplebar
                                  >
                                    <div className="fk-addons-table">
                                      <div className="fk-addons-table__head text-center">
                                        variations
                                      </div>
                                      <div className="fk-addons-table__info">
                                        <div className="row g-0">
                                          <div className="col-9 text-center border-right">
                                            <span className="fk-addons-table__info-text text-capitalize">
                                              name
                                            </span>
                                          </div>
                                          <div className="col-3 text-center">
                                            <span className="fk-addons-table__info-text text-capitalize">
                                              price
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="fk-addons-table__body">
                                        <div className="fk-addons-table__body-row">
                                          <div className="row g-0">
                                            <div className="col-9 border-right t-pl-10 t-pr-10">
                                              <label className="mx-checkbox">
                                                <input
                                                  type="radio"
                                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                                  name="variation"
                                                />
                                                <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8 fk-addons-table__body-text">
                                                  patty
                                                </span>
                                              </label>
                                            </div>
                                            <div className="col-3 text-center">
                                              <span className="fk-addons-table__body-text sm-text">
                                                50
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="fk-addons-table">
                                      <div className="fk-addons-table__head text-center">
                                        addons
                                      </div>
                                      <div className="fk-addons-table__info">
                                        <div className="row g-0">
                                          <div className="col-6 text-center border-right">
                                            <span className="fk-addons-table__info-text text-capitalize">
                                              name
                                            </span>
                                          </div>
                                          <div className="col-3 text-center border-right">
                                            <span className="fk-addons-table__info-text text-capitalize">
                                              QTY
                                            </span>
                                          </div>
                                          <div className="col-3 text-center">
                                            <span className="fk-addons-table__info-text text-capitalize">
                                              price
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="fk-addons-table__body">
                                        <div className="fk-addons-table__body-row">
                                          <div className="row g-0">
                                            <div className="col-6 border-right t-pl-10 t-pr-10">
                                              <label className="mx-checkbox">
                                                <input
                                                  type="checkbox"
                                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                                />
                                                <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8 fk-addons-table__body-text">
                                                  patty
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
                                            <div className="col-3 text-center">
                                              <span className="fk-addons-table__body-text sm-text">
                                                50
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="t-bg-white fk-addons-variation__cart">
                                      <div className="container-fluid t-mb-10 t-mt-10">
                                        <div className="row">
                                          <div className="col">
                                            <a
                                              href="#"
                                              className="t-link btn btn-danger sm-text text-uppercase"
                                            >
                                              add cart
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-6 col-xxl-7 order-xl-1">
                            <div className="fk-dish--scroll" data-simplebar>
                              <div className="list-group fk-dish row gx-2">
                                <a
                                  href="#addons-1"
                                  className="fk-dish__link t-mb-10 col-md-6 col-lg-4 col-xl-6 col-xxl-4 t-link active"
                                  data-toggle="list"
                                >
                                  <div className="fk-dish-card">
                                    <div className="fk-dish-card__img">
                                      <img
                                        src="/assets/img/b1.png"
                                        alt="foodkhan"
                                        className="img-fluid m-auto"
                                      />
                                    </div>
                                    <span className="fk-dish-card__title text-center text-uppercase">
                                      spicy chicken and more text to break
                                      layout
                                    </span>
                                  </div>
                                </a>
                                <a
                                  href="#addons-2"
                                  className="fk-dish__link t-mb-10 col-md-6 col-lg-4 col-xl-6 col-xxl-4 t-link"
                                  data-toggle="list"
                                >
                                  <div className="fk-dish-card">
                                    <div className="fk-dish-card__img">
                                      <img
                                        src="/assets/img/b2.png"
                                        alt="foodkhan"
                                        className="img-fluid"
                                      />
                                    </div>
                                    <span className="fk-dish-card__title text-center text-uppercase">
                                      spicy chicken
                                    </span>
                                  </div>
                                </a>
                                <a
                                  href="#addons-3"
                                  className="fk-dish__link t-mb-10 col-md-6 col-lg-4 col-xl-6 col-xxl-4 t-link"
                                  data-toggle="list"
                                >
                                  <div className="fk-dish-card">
                                    <div className="fk-dish-card__img">
                                      <img
                                        src="/assets/img/b2.png"
                                        alt="foodkhan"
                                        className="img-fluid"
                                      />
                                    </div>
                                    <span className="fk-dish-card__title text-center text-uppercase">
                                      spicy chicken
                                    </span>
                                  </div>
                                </a>
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
                              <li className="addons-list__item">
                                <select className="fk-select">
                                  <option data-display="Select Customer">
                                    Select Customer
                                  </option>
                                  <option value="1">
                                    Shoanur Rahman (0123456789)
                                  </option>
                                </select>
                              </li>
                              <li className="addons-list__item">
                                <select className="fk-select">
                                  <option data-display="Select Table">
                                    Select Table
                                  </option>
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
                                </select>
                              </li>
                              <li className="addons-list__item">
                                <select className="fk-select">
                                  <option data-display="Select Customer">
                                    Payment Type
                                  </option>
                                </select>
                              </li>
                              <li className="addons-list__item">
                                {/* Example single danger button  */}
                                <div className="btn-group w-100">
                                  <button
                                    type="button"
                                    className="fk-right-nav__guest-btn btn text-uppercase w-100 t-bg-white dropdown-toggle"
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
                                <img
                                  src="/assets/img/logo-alt.png"
                                  alt="foodkhan"
                                  className="img-fluid"
                                />
                              </div>
                              <div className="col-6 text-right">
                                <span className="d-block xsm-text text-uppercase">
                                  10/15/2020
                                </span>
                                <span className="d-block sm-text font-weight-bold text-uppercase font-italic">
                                  token: R12548795
                                </span>
                              </div>
                            </div>
                            <div className="row gx-0 align-items-center t-mt-10">
                              <div className="col-8">
                                <div className="row gx-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      name
                                    </span>
                                  </div>
                                  <div className="col text-center d-none d-xxl-block">
                                    :
                                  </div>
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      jhon doe
                                    </span>
                                  </div>
                                </div>
                                <div className="row gx-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      waiter
                                    </span>
                                  </div>
                                  <div className="col text-center d-none d-xxl-block">
                                    :
                                  </div>
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      jhon doe
                                    </span>
                                  </div>
                                </div>
                                <div className="row gx-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      dept. tag
                                    </span>
                                  </div>
                                  <div className="col text-center d-none d-xxl-block">
                                    :
                                  </div>
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      dine in
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="row gx-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      guest:
                                    </span>
                                  </div>
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      05
                                    </span>
                                  </div>
                                </div>
                                <div className="row gx-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      table:
                                    </span>
                                  </div>

                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      02
                                    </span>
                                  </div>
                                </div>
                                <div className="row gx-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      payment:
                                    </span>
                                  </div>
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      cash
                                    </span>
                                  </div>
                                </div>
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
                                  <div className="row g-0 border border-top-0">
                                    <div className="col-7 border-right">
                                      <span className="text-capitalize d-block t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold">
                                        Spicy Chicken Pizza
                                      </span>
                                      <div className="row g-0">
                                        <div className="col-12">
                                          <div className="row g-2">
                                            <div className="col-5 col-xxl-4">
                                              <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                addons :
                                              </span>
                                            </div>
                                            <div className="col-7 col-xxl-8">
                                              <span className="text-capitalize sm-text d-inline-block">
                                                addons, variations, aan
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="row g-2">
                                            <div className="col-5 col-xxl-4">
                                              <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                variation :
                                              </span>
                                            </div>
                                            <div className="col-7 col-xxl-8">
                                              <span className="text-capitalize sm-text d-inline-block">
                                                addons, variations, and, more,
                                                and, dolore
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
                                        5000.00
                                      </span>
                                    </div>
                                  </div>
                                  <div className="row g-0 border border-top-0">
                                    <div className="col-7 border-right">
                                      <span className="text-capitalize d-block t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold">
                                        Spicy Chicken Pizza
                                      </span>
                                      <div className="row g-0">
                                        <div className="col-12">
                                          <div className="row g-2">
                                            <div className="col-5 col-xxl-4">
                                              <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                addons :
                                              </span>
                                            </div>
                                            <div className="col-7 col-xxl-8">
                                              <span className="text-capitalize sm-text d-inline-block">
                                                addons, variations, aan
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="row g-2">
                                            <div className="col-5 col-xxl-4">
                                              <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                variation :
                                              </span>
                                            </div>
                                            <div className="col-7 col-xxl-8">
                                              <span className="text-capitalize sm-text d-inline-block">
                                                addons, variations, and, more,
                                                and, dolore
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
                                        5000.00
                                      </span>
                                    </div>
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
