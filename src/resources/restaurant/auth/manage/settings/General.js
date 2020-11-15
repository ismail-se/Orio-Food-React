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
  getSystemSettings,
} from "../../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

//pages & includes
import ManageSidebar from "../ManageSidebar";

//context consumer
import { SettingsContext } from "../../../../../contexts/Settings";
import { FoodContext } from "../../../../../contexts/Food";

const General = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //getting context values here
  let {
    loading,
    setLoading,
    generalSettings,
    setGeneralSettings,
    dataPaginating,
  } = useContext(SettingsContext);

  // States hook here
  //color picker
  let [colorPick, setColorPick] = useState({
    displayColorPicker: false,
    color: getSystemSettings(generalSettings, "type_background"),
  });

  //new item
  let [newSettings, setNewSettings] = useState({
    footerText: getSystemSettings(generalSettings, "type_footer"),
    image: null,
  });

  //useEffect == componentDidMount()
  useEffect(() => {}, []);

  //on change input field
  const handleChange = (e) => {
    setNewSettings({ ...newSettings, [e.target.name]: e.target.value });
  };

  //set image hook
  const handleItemImage = (e) => {
    setNewSettings({
      ...newSettings,
      [e.target.name]: e.target.files[0],
    });
  };

  //color picker's function
  const handleClick = () => {
    setColorPick({
      ...colorPick,
      displayColorPicker: !colorPick.displayColorPicker,
    });
  };
  const handleClose = () => {
    setColorPick({ ...colorPick, displayColorPicker: false });
  };
  const handleChangeColor = (color) => {
    setColorPick({ ...colorPick, color: color.hex });
  };

  //send req to server
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    formData.append("image", newSettings.image);
    formData.append("type_footer", newSettings.footerText);
    formData.append("type_background", colorPick.color);
    const url = BASE_URL + "/settings/general-settings";
    return axios
      .post(url, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setGeneralSettings(res.data);
        setNewSettings({
          footerText: getSystemSettings(res.data, "type_footer"),
          image: null,
        });
        setLoading(false);
        toast.success(`${_t(t("Settings has been updated"))}`, {
          position: "bottom-center",
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
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      });
  };

  //color picker css
  const styles = reactCSS({
    default: {
      color: {
        height: "24px",
        borderRadius: "2px",
        background: colorPick.color,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <>
      <Helmet>
        <title>{_t(t("General Settings"))}</title>
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
                                  {_t(t("General Settings"))}
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
                          className="row card p-2 mx-3 sm-text my-5"
                          onSubmit={handleSubmit}
                        >
                          <div className="col-12">
                            <div className="form-group mt-3">
                              <div className="mb-2">
                                <label className="control-label">
                                  {_t(t("Background of logo, clock"))}...
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <div
                                style={styles.swatch}
                                onClick={handleClick}
                                className="form-control rounded-md"
                              >
                                <div style={styles.color} />
                              </div>
                              {colorPick.displayColorPicker && (
                                <div style={styles.popover}>
                                  <div
                                    style={styles.cover}
                                    onClick={handleClose}
                                  />
                                  <SketchPicker
                                    color={colorPick.color}
                                    onChange={handleChangeColor}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="form-group mt-4">
                              <div className="mb-2">
                                <label
                                  htmlFor="image"
                                  className="control-label"
                                >
                                  {_t(t("Logo"))}
                                  <small className="text-secondary">
                                    (
                                    {_t(
                                      t(
                                        "Background color will be hidden/shown depending on width of this image"
                                      )
                                    )}
                                    )
                                  </small>
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="file"
                                  className="form-control sm-text"
                                  id="image"
                                  name="image"
                                  onChange={handleItemImage}
                                />
                              </div>
                            </div>

                            <div className="form-group mt-4">
                              <div className="mb-2">
                                <label
                                  htmlFor="footerText"
                                  className="control-label"
                                >
                                  {_t(t("Footer text"))}
                                  <span className="text-danger">*</span>{" "}
                                </label>
                              </div>
                              <div className="mb-2">
                                <textarea
                                  className="form-control sm-text pt-4"
                                  id="footerText"
                                  name="footerText"
                                  onChange={handleChange}
                                  value={newSettings.footerText}
                                  placeholder="e.g. FoodKhan | All rights reserved | 2020"
                                  required
                                />
                              </div>
                            </div>

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

export default General;
