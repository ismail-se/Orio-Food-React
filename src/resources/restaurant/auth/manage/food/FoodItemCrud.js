import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../../BaseUrl";

//functions
import {
  _t,
  getCookie,
  tableLoading,
} from "../../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

//pages & includes
import ManageSidebar from "../ManageSidebar";

//context consumer
import { SettingsContext } from "../../../../../contexts/Settings";
import { FoodContext } from "../../../../../contexts/Food";

const FoodItemCrud = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //getting context values here
  let { loading, setLoading, dataPaginating } = useContext(SettingsContext);

  let {
    foodGroupForSearch,
    propertyGroupForSearch,
    variationForSearch,
  } = useContext(FoodContext);

  // States hook here
  //new item
  let [newItem, setNewItem] = useState({
    itemGroup: null,
    name: "",
    price: "",
    image: null,
    hasProperty: false,
    properties: null,
    hasVariation: false,
    variations: null,
    edit: false,
    editSlug: null,
    uploading: false,
  });

  let [priceForVariations, setPriceForVariations] = useState(null);

  //useEffect == componentDidMount()
  useEffect(() => {}, []);

  //on change input field
  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  //set image hook
  const handleItemImage = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.files[0],
    });
  };

  //set variations hook
  const handleSetVariations = (variations) => {
    setNewItem({ ...newItem, variations });
  };

  //set each variation price
  const handleVariationPrice = (e) => {
    setPriceForVariations({
      ...priceForVariations,
      [e.target.name]: e.target.value,
    });
  };

  //handle Set item group hook
  const handleSetItemGroup = (itemGroup) => {
    setNewItem({ ...newItem, itemGroup });
  };

  //has Property
  const handlePropertyCheckboxChange = (e) => {
    setNewItem({ ...newItem, hasProperty: !newItem.hasProperty });
  };

  //has variations
  const handleVariationCheckboxChange = (e) => {
    if (newItem.hasVariation === true) {
      setNewItem({
        ...newItem,
        variations: null,
        hasVariation: !newItem.hasVariation,
      });
    } else {
      setNewItem({ ...newItem, hasVariation: !newItem.hasVariation });
    }
  };

  //send to server
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.itemGroup !== null) {
      let a = Object.entries(priceForVariations);
      console.log(a);
      let formData = new FormData();
      formData.append("variations[]", a);
      const url = BASE_URL + "/settings/new-food-item";
      return axios
        .post(url, formData, {
          headers: { Authorization: `Bearer ${getCookie()}` },
        })
        .then((res) => {
          console.log(res.data);
        });
    } else {
      toast.error(`${_t(t("Please select a group for this item"))}`, {
        position: "bottom-center",
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
        <title>{_t(t("Add New Item"))}</title>
      </Helmet>

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
                <div
                  className="fk-scroll--pos-menu table-bottom-info-hide"
                  data-simplebar
                >
                  <div className="t-pl-15 t-pr-15">
                    {/* next page data spin loading */}
                    <div className={`${dataPaginating && "loading"}`}></div>
                    {/* spin loading ends */}

                    {/* Loading effect */}
                    {loading === true ? (
                      tableLoading()
                    ) : (
                      <div key="smtp-form">
                        <div className="row gx-2 align-items-center t-pt-15 t-pb-15">
                          <div className="col-md-6 col-lg-5 t-mb-15 mb-md-0">
                            <ul className="t-list fk-breadcrumb">
                              <li className="fk-breadcrumb__list">
                                <span className="t-link fk-breadcrumb__link text-capitalize">
                                  {_t(t("Add new item"))}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-6 col-lg-7">
                            <div className="row gx-3 align-items-center"></div>
                          </div>
                        </div>

                        {/* Form starts here */}
                        <form
                          className="row card p-2 mx-3 mb-5"
                          onSubmit={handleSubmit}
                        >
                          <div className="col-12">
                            <div className="form-group mt-2">
                              <div className="mb-2">
                                <label
                                  htmlFor="itemGroup"
                                  className="control-label"
                                >
                                  {_t(t("Item Group"))}
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <Select
                                options={foodGroupForSearch}
                                components={makeAnimated()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                classNamePrefix="select"
                                onChange={handleSetItemGroup}
                                placeholder={
                                  _t(t("Please select a group")) + ".."
                                }
                              />
                            </div>

                            <div className="form-group mt-3">
                              <div className="mb-2">
                                <label htmlFor="name" className="control-label">
                                  {_t(t("Name"))}
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  name="name"
                                  onChange={handleChange}
                                  placeholder="e.g. Spicy chicken burger"
                                  required
                                />
                              </div>
                            </div>

                            {!newItem.hasVariation && (
                              <div className="form-group mt-4">
                                <div className="mb-2">
                                  <label
                                    htmlFor="price"
                                    className="control-label"
                                  >
                                    {_t(t("Price"))}
                                    <span className="text-primary">* </span>
                                    <small className="text-secondary">
                                      ({_t(t("Enter price in USD"))})
                                    </small>
                                  </label>
                                </div>
                                <div className="mb-2">
                                  <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="form-control"
                                    name="price"
                                    onChange={handleChange}
                                    placeholder="e.g. Type price of this item in 'US dollar'"
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            <div className="form-group mt-3">
                              <div className="mb-2">
                                <label
                                  htmlFor="image"
                                  className="control-label"
                                >
                                  {_t(t("Image"))}
                                  <span className="text-danger">*</span>{" "}
                                  <small className="text-secondary">
                                    ({_t(t("Square Image Preferable"))})
                                  </small>
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="file"
                                  className="form-control"
                                  id="image"
                                  name="image"
                                  onChange={handleItemImage}
                                  required
                                />
                              </div>
                            </div>
                            <div className="form-check mt-4">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="propertyCheck"
                                checked={newItem.hasProperty}
                                onChange={handlePropertyCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="propertyCheck"
                              >
                                {_t(t("Has properties?"))}
                              </label>
                            </div>

                            {newItem.hasProperty && (
                              <div className="form-group mt-2 ml-4">
                                <div className="mb-2">
                                  <label
                                    htmlFor="image"
                                    className="control-label"
                                  >
                                    {_t(t("Add properties"))}
                                  </label>
                                </div>
                                <Select
                                  options={propertyGroupForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  isMulti
                                  placeholder={
                                    _t(t("Please select properties")) + ".."
                                  }
                                />
                              </div>
                            )}

                            <div className="form-check mt-4">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="variationCheck"
                                checked={newItem.hasVariation}
                                onChange={handleVariationCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="variationCheck"
                              >
                                {_t(t("Has variations?"))}
                              </label>
                            </div>

                            {newItem.hasVariation && (
                              <div className="form-group mt-2 ml-4">
                                <div className="mb-2">
                                  <label
                                    htmlFor="image"
                                    className="control-label"
                                  >
                                    {_t(t("Add variations"))}
                                  </label>
                                </div>
                                <Select
                                  options={variationForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  isMulti
                                  onChange={handleSetVariations}
                                  placeholder={
                                    _t(t("Please select variations")) + ".."
                                  }
                                />
                              </div>
                            )}
                            {newItem.variations !== null && [
                              newItem.variations.length > 0 && (
                                <div className="card ml-4 mt-3 p-3">
                                  <div className="card-header bg-primary text-white rounded-sm text-center">
                                    {_t(
                                      t("Please enter price for each variation")
                                    )}
                                  </div>
                                  {newItem.variations.map((variationItem) => {
                                    return (
                                      <div className="form-group mt-4">
                                        <div className="mb-2">
                                          <label
                                            htmlFor={variationItem.slug}
                                            className="control-label"
                                          >
                                            {_t(t("Total price of"))}{" "}
                                            {variationItem.name}
                                            <span className="text-primary">
                                              *{" "}
                                            </span>
                                            <small className="text-secondary">
                                              ({_t(t("Enter price in USD"))})
                                            </small>
                                          </label>
                                        </div>
                                        <div className="mb-2">
                                          <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="form-control"
                                            id={variationItem.slug}
                                            name={variationItem.slug}
                                            onChange={handleVariationPrice}
                                            placeholder="e.g. Type price of this item in 'US dollar'"
                                            required
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ),
                            ]}

                            <div className="form-group mt-5 pb-2">
                              <div className="col-lg-12">
                                <button
                                  className="btn btn-primary px-5"
                                  type="submit"
                                >
                                  {_t(t("Save"))}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Rightbar contents end*/}
          </div>
        </div>
      </main>
      {/* main body ends */}
    </>
  );
};

export default FoodItemCrud;
