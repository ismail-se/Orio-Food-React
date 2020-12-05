import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
//functions
import { _t } from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import Skeleton from "react-loading-skeleton";
import Moment from "react-moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";

//importing context consumer here
import { RestaurantContext } from "../../../../contexts/Restaurant";
import { FoodContext } from "../../../../contexts/Food";

const Kitchen = () => {
  const { t } = useTranslation();

  const {
    //kitchen dashboard
    getKitchenNewOrders,
    kithcenNewOrders,
    setKithcenNewOrders,
  } = useContext(RestaurantContext);

  const {
    //food group
    foodGroupForSearch,
  } = useContext(FoodContext);

  //state hooks
  const [filterOrder, setFilterOrder] = useState({
    isFiltered: false,
    filterKey: "",
    foodGroups: null,
  });

  useEffect(() => {
    getKitchenNewOrders();

    let tempFoodGroups = foodGroupForSearch ? foodGroupForSearch : null;
    //to avoid duplcate push to first
    let findAll =
      tempFoodGroups !== null &&
      tempFoodGroups.find((theItem) => {
        return theItem.name === "All";
      });

    //push "all" to foodgroup
    tempFoodGroups !== null &&
      findAll === undefined &&
      tempFoodGroups.unshift({ name: "All" });

    setFilterOrder({
      ...filterOrder,
      foodGroups: tempFoodGroups,
    });
  }, [foodGroupForSearch]);

  //filter ordered items
  const handleFilter = (foodGrp) => {
    setFilterOrder({
      ...filterOrder,
      isFiltered: foodGrp.name == "All" ? false : true,
      filterKey: foodGrp.name,
    });
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
                <div className="col-md-5 t-mb-15 mb-md-0">
                  <ul className="t-list fk-breadcrumb">
                    <li className="fk-breadcrumb__list">
                      <span className="t-link fk-breadcrumb__link text-uppercase">
                        kitchen dashboard
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    onClick=""
                    className="btn btn-primary btn-block sm-text text-uppercase mb-2 mb-md-0 text-truncate"
                  >
                    Check new orders
                  </button>
                </div>
                <div className="col-md-2">
                  <Select
                    options={filterOrder.foodGroups && filterOrder.foodGroups}
                    components={makeAnimated()}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.name}
                    classNamePrefix="select"
                    className="xsm-text mb-2 mb-md-0 "
                    onChange={handleFilter}
                    maxMenuHeight="200px"
                    placeholder={_t(t("Filter by group")) + ".."}
                  />
                </div>

                <div className="col-md-3">
                  <div className="input-group">
                    <div className="form-file">
                      <input
                        type="text"
                        className="form-control border-0 form-control--light-1 rounded-0"
                        placeholder={_t(t("Search by token")) + ".."}
                      />
                    </div>
                    <button className="btn btn-primary" type="button">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters g-4 mt-1">
              {kithcenNewOrders ? (
                [
                  kithcenNewOrders.length > 0 ? (
                    kithcenNewOrders.map((item, index) => {
                      return (
                        <div
                          className="col-md-6 col-xl-4"
                          data-category={index + 1}
                        >
                          <div className="fk-order-token t-bg-white p-3 h-100">
                            <div className="fk-order-token__footer text-right">
                              <button
                                type="button"
                                className="btn btn-success xsm-text text-uppercase btn-lg mr-2"
                              >
                                Order ready
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary xsm-text text-uppercase btn-lg"
                              >
                                Accept order
                              </button>
                            </div>
                            <div className="fk-order-token__body">
                              <div className="fk-addons-table">
                                <div className="fk-addons-table__head d-flex justify-content-between px-3">
                                  <span>order token: #{item.token.id}</span>
                                  <span>
                                    ordered at:{" "}
                                    <Moment format="LT">
                                      {item.token.time}
                                    </Moment>
                                  </span>
                                </div>
                                <div className="fk-addons-table__info">
                                  <div className="row g-0">
                                    <div className="col-2 text-center border-right py-2">
                                      <span className="fk-addons-table__info-text text-capitalize">
                                        S/L
                                      </span>
                                    </div>
                                    <div className="col-3 text-center border-right py-2">
                                      <span className="fk-addons-table__info-text text-capitalize">
                                        food
                                      </span>
                                    </div>
                                    <div className="col-4 text-center border-right py-2">
                                      <span className="fk-addons-table__info-text text-capitalize">
                                        Additional Info
                                      </span>
                                    </div>
                                    <div className="col-2 text-center border-right py-2">
                                      <span className="fk-addons-table__info-text text-capitalize">
                                        QT
                                      </span>
                                    </div>
                                    <div className="col-1 text-center py-2">
                                      <span className="fk-addons-table__info-text text-capitalize">
                                        <i className="fa fa-check"></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="fk-addons-table__body">
                                  {item.orderedItems.map(
                                    (thisItem, indexThisItem) => {
                                      if (filterOrder.isFiltered) {
                                        if (
                                          thisItem.food_group ===
                                          filterOrder.filterKey
                                        ) {
                                          return (
                                            <div class="fk-addons-table__body-row">
                                              <div class="row g-0">
                                                <div class="col-2 text-center border-right d-flex py-2">
                                                  <span class="fk-addons-table__info-text text-capitalize m-auto">
                                                    {indexThisItem + 1}
                                                  </span>
                                                </div>
                                                <div class="col-3 text-center border-right d-flex py-2">
                                                  <span class="fk-addons-table__info-text text-capitalize m-auto">
                                                    {thisItem.food_item} (
                                                    {thisItem.food_group})
                                                  </span>
                                                </div>
                                                <div class="col-4 text-center border-right t-pl-10 t-pr-10 py-2">
                                                  {thisItem.variation !==
                                                    null && (
                                                    <span class="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                                      <span class="font-weight-bold mr-1">
                                                        variation:
                                                      </span>
                                                      {thisItem.variation}
                                                    </span>
                                                  )}

                                                  {thisItem.properties !==
                                                    null && (
                                                    <span class="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                                      <span class="font-weight-bold mr-1">
                                                        properties:
                                                      </span>
                                                      {JSON.parse(
                                                        thisItem.properties
                                                      ).map(
                                                        (
                                                          propertyItem,
                                                          thisIndex
                                                        ) => {
                                                          if (
                                                            thisIndex !==
                                                            JSON.parse(
                                                              thisItem.properties
                                                            ).length -
                                                              1
                                                          ) {
                                                            return (
                                                              propertyItem.property +
                                                              ", "
                                                            );
                                                          } else {
                                                            return propertyItem.property;
                                                          }
                                                        }
                                                      )}
                                                    </span>
                                                  )}
                                                </div>
                                                <div class="col-2 text-center border-right d-flex py-2">
                                                  <span class="fk-addons-table__info-text text-capitalize m-auto">
                                                    {thisItem.quantity}
                                                  </span>
                                                </div>

                                                <div className="col-1 text-center d-flex py-2">
                                                  <label className="mx-checkbox mx-checkbox--empty m-auto">
                                                    <input
                                                      type="checkbox"
                                                      className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm mt-0-kitchen"
                                                    />
                                                    <span className="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text"></span>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else {
                                        return (
                                          <div class="fk-addons-table__body-row">
                                            <div class="row g-0">
                                              <div class="col-2 text-center border-right d-flex py-2">
                                                <span class="fk-addons-table__info-text text-capitalize m-auto">
                                                  {indexThisItem + 1}
                                                </span>
                                              </div>
                                              <div class="col-3 text-center border-right d-flex py-2">
                                                <span class="fk-addons-table__info-text text-capitalize m-auto">
                                                  {thisItem.food_item} (
                                                  {thisItem.food_group})
                                                </span>
                                              </div>
                                              <div class="col-4 text-center border-right t-pl-10 t-pr-10 py-2">
                                                {thisItem.variation !==
                                                  null && (
                                                  <span class="fk-addons-table__info-text text-capitalize d-block text-left t-pt-5">
                                                    <span class="font-weight-bold mr-1">
                                                      variation:
                                                    </span>
                                                    {thisItem.variation}
                                                  </span>
                                                )}

                                                {thisItem.properties !==
                                                  null && (
                                                  <span class="fk-addons-table__info-text text-capitalize d-block text-left t-pb-5">
                                                    <span class="font-weight-bold mr-1">
                                                      properties:
                                                    </span>
                                                    {JSON.parse(
                                                      thisItem.properties
                                                    ).map(
                                                      (
                                                        propertyItem,
                                                        thisIndex
                                                      ) => {
                                                        if (
                                                          thisIndex !==
                                                          JSON.parse(
                                                            thisItem.properties
                                                          ).length -
                                                            1
                                                        ) {
                                                          return (
                                                            propertyItem.property +
                                                            ", "
                                                          );
                                                        } else {
                                                          return propertyItem.property;
                                                        }
                                                      }
                                                    )}
                                                  </span>
                                                )}
                                              </div>
                                              <div class="col-2 text-center border-right d-flex py-2">
                                                <span class="fk-addons-table__info-text text-capitalize m-auto">
                                                  {thisItem.quantity}
                                                </span>
                                              </div>

                                              <div className="col-1 text-center d-flex py-2">
                                                <label className="mx-checkbox mx-checkbox--empty m-auto">
                                                  <input
                                                    type="checkbox"
                                                    className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm mt-0-kitchen"
                                                  />
                                                  <span className="mx-checkbox__text text-capitalize t-text-heading fk-addons-table__body-text"></span>
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12" data-category="1">
                      <div
                        className="fk-order-token t-bg-white p-3 text-center text-primary"
                        style={{ minHeight: "560px" }}
                      >
                        No order found
                      </div>
                    </div>
                  ),
                ]
              ) : (
                <div className="col-12" data-category="1">
                  <Skeleton
                    className="fk-order-token t-bg-white p-3 border border-2"
                    style={{ minHeight: "560px" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Kitchen;
