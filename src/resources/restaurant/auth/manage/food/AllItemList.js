import React, { useState, useContext, useEffect } from "react";
import { useHistory, NavLink } from "react-router-dom";

//pages & includes
import ManageSidebar from "../ManageSidebar";

//functions
import {
  _t,
  getCookie,
  modalLoading,
  tableLoading,
  pagination,
  paginationLoading,
  showingData,
  searchedShowingData,
  formatPrice,
} from "../../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../../BaseUrl";

//3rd party packages
import { Helmet } from "react-helmet";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//context consumer
import { FoodContext } from "../../../../../contexts/Food";

const AllItemList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //getting context values here

  let {
    //common
    loading,
    setLoading,

    //food
    getFood,
    foodList,
    setFoodList,
    setPaginatedFood,
    foodForSearch,
    setFoodForSearch,

    //pagination
    dataPaginating,
  } = useContext(FoodContext);

  // States hook here
  let [variations, setVariations] = useState({
    //common
    edit: false,
    uploading: false,

    //food item === item
    item: null,

    //variation list === list
    list: null,

    //new price of variations
    newPrice: null,

    //variation to delete- id of food_with_variations table
    deletedVariations: null,

    //if all variation deleted
    priceAfterAllVariationDelete: "",
  });

  //search result
  let [searchedFoodGroup, setSearchedFoodGroup] = useState({
    list: null,
    searched: false,
  });

  //useEffect == componentDidMount
  useEffect(() => {}, []);

  //search food group here
  const handleSearch = (e) => {
    let searchInput = e.target.value.toLowerCase();
    if (searchInput.length === 0) {
      setSearchedFoodGroup({ ...searchedFoodGroup, searched: false });
    } else {
      let searchedList = foodForSearch.filter((item) => {
        let lowerCaseItemName = item.name.toLowerCase();
        return lowerCaseItemName.includes(searchInput);
      });
      setSearchedFoodGroup({
        ...searchedFoodGroup,
        list: searchedList,
        searched: true,
      });
    }
  };

  //delete confirmation modal of paymentType
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
                  // handleDeleteFoodGroup(slug);
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
        <title>{_t(t("Food Items"))}</title>
      </Helmet>

      {/* variations modal */}
      <div className="modal fade" id="foodVariations" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="fk-sm-card__title">
                  {/* food item name in variation modal */}
                  {!variations.edit
                    ? [variations.item && variations.item.name]
                    : [
                        _t(t("Update variations of")) +
                          " " +
                          [variations.item && variations.item.name],
                      ]}
                  {/* food item name in variation modal ends */}
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
              {/* showing this-> if update has been submitted or not */}
              {!variations.uploading && (
                <div className="text-right">
                  <button
                    className={`btn btn-primary text-capitalize mb-3 sm-text px-4`}
                    onClick={() => {
                      //set variations which are selected to delete === null; if "Cancel" button is clicked,
                      //edit variation true if "Edit" button clicked
                      setVariations({
                        ...variations,
                        deletedVariations:
                          variations.edit === true
                            ? null
                            : variations.deletedVariations,
                        edit: !variations.edit,
                      });
                    }}
                  >
                    {!variations.edit ? _t(t("edit")) : _t(t("cancel"))}
                  </button>
                </div>
              )}
              {/* if update has been submitted or not ends here */}

              {/* show table data / form / show modal loading */}
              {variations.edit === false ? (
                // if variation edit is false- show table data
                <div key="fragment-food-group-1 table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="align-middle">
                      <tr>
                        <th
                          scope="col"
                          className="sm-text align-middle text-center border-1 border"
                        >
                          {_t(t("S/L"))}
                        </th>

                        <th
                          scope="col"
                          className="sm-text align-middle text-center border-1 border"
                        >
                          {_t(t("Variation name"))}
                        </th>
                        <th
                          scope="col"
                          className="sm-text align-middle text-center border-1 border"
                        >
                          {_t(t("Price"))}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.list &&
                        variations.list.map((item, index) => {
                          return (
                            <tr
                              scope="row"
                              className="xsm-text align-middle text-center"
                            >
                              <td className="xsm-text text-capitalize align-middle text-center">
                                {index + 1}
                              </td>
                              <td className="xsm-text text-capitalize align-middle text-center">
                                {item.variation_name}
                              </td>
                              <td className="xsm-text text-capitalize align-middle text-center">
                                {formatPrice(item.food_with_variation_price)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                //variation edit is true here- show input box for price

                <div key="fragment2">
                  {/* check if edit is true and update button clicked */}
                  {variations.uploading === false ? (
                    //show form if Update button not clicked
                    <form
                      className="table-responsive"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setVariations({ ...variations, uploading: true });
                      }}
                    >
                      <table className="table table-bordered table-striped">
                        <thead className="align-middle">
                          <tr>
                            <th
                              scope="col"
                              className="sm-text align-middle text-center border-1 border"
                            >
                              {_t(t("S/L"))}
                            </th>

                            <th
                              scope="col"
                              className="sm-text align-middle text-center border-1 border"
                            >
                              {_t(t("Variation name"))}
                            </th>
                            <th
                              scope="col"
                              className="sm-text align-middle text-center border-1 border"
                            >
                              {_t(t("Price"))}
                            </th>
                            <th
                              scope="col"
                              className="sm-text align-middle text-center border-1 border"
                            >
                              {_t(t("New price"))}{" "}
                              <small className="text-primary">
                                ({_t(t("optional"))})
                              </small>
                            </th>
                            <th
                              scope="col"
                              className="sm-text align-middle text-center border-1 border"
                            >
                              {_t(t("Action"))}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* loop to show each variation item with input box of price */}
                          {variations.list &&
                            variations.list.map((item, index) => {
                              return (
                                <tr
                                  scope="row"
                                  className={`xsm-text align-middle text-center ${
                                    //text deleted css if food_with_variation id exist is array of variations to delete
                                    variations.deletedVariations &&
                                    variations.deletedVariations.includes(
                                      item.food_with_variation_id
                                    )
                                      ? "text-deleted text-primary"
                                      : ""
                                  }`}
                                >
                                  <td className="xsm-text text-capitalize align-middle text-center">
                                    {index + 1}
                                  </td>
                                  <td className="xsm-text text-capitalize align-middle text-center">
                                    {item.variation_name}
                                  </td>
                                  <td className="xsm-text text-capitalize align-middle text-center">
                                    {formatPrice(
                                      item.food_with_variation_price
                                    )}
                                  </td>
                                  <td className="xsm-text text-capitalize align-middle text-center">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      name={item.food_with_variation_id}
                                      onChange={(e) => {
                                        setVariations({
                                          //set new price for each variation
                                          ...variations,
                                          newPrice: {
                                            ...variations.newPrice,
                                            [e.target.name]: e.target.value,
                                          },
                                        });
                                      }}
                                      className="form-control xsm-text text-center variation-min-price-input-width"
                                      placeholder="Type new price in us dollar"
                                      disabled={
                                        //disable input field of variation if item is selected to delete
                                        variations.deletedVariations &&
                                        variations.deletedVariations.includes(
                                          item.food_with_variation_id
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="xsm-text text-capitalize align-middle text-center">
                                    {/* Delete button or Undo button to display, show undo button if item is in array of variation to delete-->variations.deletedVariations */}
                                    {variations.deletedVariations &&
                                    variations.deletedVariations.includes(
                                      item.food_with_variation_id
                                    ) ? (
                                      //Undo button
                                      <button
                                        type="button"
                                        className="btn btn-success text-dark btn-sm py-0"
                                        onClick={() => {
                                          //Remove variation item from-->(deleted variation array which will be sent to server to delete)
                                          let deletedArray = [];
                                          if (variations.deletedVariations) {
                                            //Pushing all old items to an empty array
                                            variations.deletedVariations.map(
                                              (deletedItem) => {
                                                deletedArray.push(deletedItem);
                                              }
                                            );
                                          }
                                          //removing the item from new array
                                          let tempDeletedArray = deletedArray.filter(
                                            (undoItem) => {
                                              return (
                                                undoItem !==
                                                item.food_with_variation_id
                                              );
                                            }
                                          );
                                          //set new array as array of variation items to delete-->(which will be sent to server to delete)
                                          setVariations({
                                            ...variations,
                                            deletedVariations: tempDeletedArray,
                                          });
                                        }}
                                      >
                                        {_t(t("Undo"))}
                                        {/* Undo button */}
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-primary btn-sm py-0"
                                        onClick={() => {
                                          //add variation item to-->(deleted variation array which will be sent to server to delete)
                                          let deletedArray = [];
                                          if (variations.deletedVariations) {
                                            //Pushing all old items to an empty array
                                            variations.deletedVariations.map(
                                              (deletedItem) => {
                                                deletedArray.push(deletedItem);
                                              }
                                            );
                                          }
                                          //adding the item to new array
                                          deletedArray.push(
                                            item.food_with_variation_id
                                          );

                                          //set new array as array of variation items to delete-->(which will be sent to server to delete)
                                          setVariations({
                                            ...variations,
                                            deletedVariations: deletedArray,
                                          });
                                        }}
                                      >
                                        {_t(t("Delete"))}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>

                      {/* input field for price if all variations has been deleted */}
                      {variations.list &&
                        variations.deletedVariations && [
                          variations.deletedVariations.length ===
                          variations.list.length ? (
                            //Check array.length to delete from food_with variations table === total variation of the items
                            <div className="mt-4">
                              <label htmlFor="price" className="form-label">
                                {_t(t("Price of the food item"))}
                                <small className="text-primary">*</small>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-control"
                                id="price"
                                name="price"
                                placeholder="Type price for this item in 'US dollar'"
                                value={
                                  variations.priceAfterAllVariationDelete || ""
                                }
                                required
                                onChange={(e) => {
                                  //set price of all variation selected to delete
                                  setVariations({
                                    ...variations,
                                    priceAfterAllVariationDelete:
                                      e.target.value,
                                  });
                                }}
                              />
                            </div>
                          ) : (
                            ""
                          ),
                        ]}
                      <button
                        type="submit"
                        className="btn btn-primary sm-text px-4 mt-3 mb-2"
                      >
                        {_t(t("Update"))}
                      </button>
                    </form>
                  ) : (
                    //show loading if update has been clicked
                    <div>
                      <div className="text-center text-primary font-weight-bold text-uppercase">
                        {_t(t("Please wait"))}
                      </div>
                      {modalLoading(5)}
                    </div>
                  )}
                </div>
              )}
              {/* show table data / form / show modal loading ends here*/}
            </div>
          </div>
        </div>
      </div>
      {/* variations modal Ends*/}

      {/* main body */}
      <main id="main" data-simplebar>
        <div className="container">
          <div className="row t-mt-10 gx-2">
            {/* left Sidebar */}
            <div className="col-lg-3 col-xxl-2 t-mb-30 mb-lg-0">
              <ManageSidebar />
            </div>
            {/* left Sidebar ends */}

            {/* Rightbar contents */}
            <div className="col-lg-9 col-xxl-10 t-mb-30 mb-lg-0">
              <div className="t-bg-white">
                <div className="fk-scroll--pos-menu" data-simplebar>
                  <div className="t-pl-15 t-pr-15">
                    {/* Loading effect */}
                    {variations.uploading === true || loading === true ? (
                      tableLoading()
                    ) : (
                      <div key="fragment3">
                        {/* next page data spin loading */}
                        <div className={`${dataPaginating && "loading"}`}></div>
                        {/* spin loading ends */}

                        <div className="row gx-2 align-items-center t-pt-15 t-pb-15">
                          <div className="col-md-6 col-lg-5 t-mb-15 mb-md-0">
                            <ul className="t-list fk-breadcrumb">
                              <li className="fk-breadcrumb__list">
                                <span className="t-link fk-breadcrumb__link text-capitalize">
                                  {!searchedFoodGroup.searched
                                    ? _t(t("Food Items List"))
                                    : _t(t("Search Result"))}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-6 col-lg-7">
                            <div className="row gx-3 align-items-center">
                              {/* Search group */}
                              <div className="col-md-9 t-mb-15 mb-md-0">
                                <div className="input-group">
                                  <div className="form-file">
                                    <input
                                      type="text"
                                      className="form-control border-0 form-control--light-1 rounded-0"
                                      placeholder={_t(t("Search")) + ".."}
                                      onChange={handleSearch}
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

                              {/* Add group modal trigger button */}
                              <div className="col-md-3 text-md-right">
                                <NavLink
                                  to="/dashboard/manage/food/add-new"
                                  className="btn btn-primary xsm-text text-uppercase btn-lg btn-block"
                                >
                                  {_t(t("add new"))}
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Table */}
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped min-table-height">
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
                                  {_t(t("Image"))}
                                </th>

                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  {_t(t("Name"))}
                                </th>

                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  {_t(t("Group"))}
                                </th>

                                <th
                                  scope="col"
                                  className="sm-text text-capitalize align-middle text-center border-1 border"
                                >
                                  {_t(t("Price"))}
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
                              {!searchedFoodGroup.searched
                                ? [
                                    foodList && [
                                      foodList.data.length === 0 ? (
                                        <tr className="align-middle">
                                          <td
                                            scope="row"
                                            colSpan="6"
                                            className="xsm-text align-middle text-center"
                                          >
                                            {_t(t("No data available"))}
                                          </td>
                                        </tr>
                                      ) : (
                                        foodList.data.map((item, index) => {
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
                                                  (foodList.current_page - 1) *
                                                    foodList.per_page}
                                              </th>

                                              <td className="xsm-text align-middle d-flex justify-content-center">
                                                <div
                                                  className="table-img-large"
                                                  style={{
                                                    backgroundImage: `url(${
                                                      item.image !== null
                                                        ? item.image
                                                        : "/assets/img/def_food.png"
                                                    })`,
                                                  }}
                                                ></div>
                                              </td>

                                              <td className="xsm-text text-capitalize align-middle text-center">
                                                {item.name}
                                              </td>

                                              <td className="xsm-text text-capitalize align-middle text-center">
                                                {item.food_group}
                                              </td>

                                              <td className="xsm-text text-capitalize align-middle text-center">
                                                {item.price ? (
                                                  formatPrice(item.price)
                                                ) : (
                                                  <button
                                                    className="btn btn-primary btn-sm py-0"
                                                    onClick={() =>
                                                      setVariations({
                                                        ...variations,
                                                        edit: false,
                                                        item: item,
                                                        list: item.variations,
                                                        deletedVariations: null,
                                                      })
                                                    }
                                                    data-toggle="modal"
                                                    data-target="#foodVariations"
                                                  >
                                                    {_t(t("check variations"))}
                                                  </button>
                                                )}
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
                                                    <button
                                                      className="dropdown-item sm-text text-capitalize"
                                                      onClick={() =>
                                                        // handleSetEdit(item.slug)
                                                        ""
                                                      }
                                                      data-toggle="modal"
                                                      data-target="#editFood"
                                                    >
                                                      <span className="t-mr-8">
                                                        <i className="fa fa-pencil"></i>
                                                      </span>
                                                      {_t(t("Edit"))}
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
                                                      {_t(t("Delete"))}
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
                                    searchedFoodGroup && [
                                      searchedFoodGroup.list.length === 0 ? (
                                        <tr className="align-middle">
                                          <td
                                            scope="row"
                                            colSpan="6"
                                            className="xsm-text align-middle text-center"
                                          >
                                            {_t(t("No data available"))}
                                          </td>
                                        </tr>
                                      ) : (
                                        searchedFoodGroup.list.map(
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
                                                    (foodList.current_page -
                                                      1) *
                                                      foodList.per_page}
                                                </th>

                                                <td className="xsm-text text-capitalize align-middle text-center">
                                                  {item.name}
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
                                                      <button
                                                        className="dropdown-item sm-text text-capitalize"
                                                        onClick={() =>
                                                          // handleSetEdit(
                                                          //   item.slug
                                                          // )
                                                          ""
                                                        }
                                                        data-toggle="modal"
                                                        data-target="#editFood"
                                                      >
                                                        <span className="t-mr-8">
                                                          <i className="fa fa-pencil"></i>
                                                        </span>
                                                        {_t(t("Edit"))}
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
                                                        {_t(t("Delete"))}
                                                      </button>
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )
                                      ),
                                    ],
                                  ]}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* pagination loading effect */}
              {variations.uploading === true || loading === true
                ? paginationLoading()
                : [
                    // logic === !searched
                    !searchedFoodGroup.searched ? (
                      <div key="fragment4">
                        <div className="t-bg-white mt-1 t-pt-5 t-pb-5">
                          <div className="row align-items-center t-pl-15 t-pr-15">
                            <div className="col-md-7 t-mb-15 mb-md-0">
                              {/* pagination function */}
                              {pagination(foodList, setPaginatedFood)}
                            </div>
                            <div className="col-md-5">
                              <ul className="t-list d-flex justify-content-md-end align-items-center">
                                <li className="t-list__item">
                                  <span className="d-inline-block sm-text">
                                    {showingData(foodList)}
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
                                    setSearchedFoodGroup({
                                      ...searchedFoodGroup,
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
                                    searchedFoodGroup,
                                    foodForSearch
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
            {/* Rightbar contents end*/}
          </div>
        </div>
      </main>
      {/* main body ends */}
    </>
  );
};

export default AllItemList;
