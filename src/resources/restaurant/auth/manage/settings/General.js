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
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

//pages & includes
import ManageSidebar from "../ManageSidebar";

//context consumer
import { SettingsContext } from "../../../../../contexts/Settings";

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
  //color text
  let [colorTextPick, setColorTextPick] = useState({
    displayColorTextPicker: false,
    color: getSystemSettings(generalSettings, "type_color"),
  });

  //new item
  let [newSettings, setNewSettings] = useState({
    footerText: getSystemSettings(generalSettings, "type_footer"),
    siteName: getSystemSettings(generalSettings, "siteName"),
    address: getSystemSettings(generalSettings, "address"),
    phnNo: getSystemSettings(generalSettings, "phnNo"),
    vat: getSystemSettings(generalSettings, "type_vat"),
    image: null,
    favicon: null,
    print_kitchen_bill:
      getSystemSettings(generalSettings, "print_kitchen_bill") === "1" ? 1 : 0,
    play_sound:
      getSystemSettings(generalSettings, "play_sound") === "1" ? 1 : 0,
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

  //favicon
  const handleItemFavicon = (e) => {
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

  //text color
  const handleClickText = () => {
    setColorTextPick({
      ...colorTextPick,
      displayColorTextPicker: !colorTextPick.displayColorTextPicker,
    });
  };
  const handleCloseText = () => {
    setColorTextPick({ ...colorTextPick, displayColorTextPicker: false });
  };
  const handleChangeColorText = (color) => {
    setColorTextPick({ ...colorTextPick, color: color.hex });
  };

  //send req to server
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    formData.append("image", newSettings.image);
    formData.append("favicon", newSettings.favicon);
    formData.append("type_background", colorPick.color);
    formData.append("type_color", colorTextPick.color);
    formData.append("type_footer", newSettings.footerText);
    formData.append("siteName", newSettings.siteName);
    formData.append("address", newSettings.address);
    formData.append("phnNo", newSettings.phnNo);
    formData.append("type_vat", newSettings.vat);
    formData.append("print_kitchen_bill", newSettings.print_kitchen_bill);
    formData.append("play_sound", newSettings.play_sound);
    const url = BASE_URL + "/settings/general-settings";
    return axios
      .post(url, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setGeneralSettings(res.data);
        setNewSettings({
          footerText: getSystemSettings(res.data, "type_footer"),
          siteName: getSystemSettings(res.data, "siteName"),
          address: getSystemSettings(res.data, "address"),
          phnNo: getSystemSettings(res.data, "phnNo"),
          vat: getSystemSettings(res.data, "type_vat"),
          image: null,
          favicon: null,
          print_kitchen_bill:
            getSystemSettings(res.data, "print_kitchen_bill") === "1" ? 1 : 0,
          play_sound: getSystemSettings(res.data, "play_sound") === "1" ? 1 : 0,
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

  const stylesText = reactCSS({
    default: {
      color: {
        height: "24px",
        borderRadius: "2px",
        background: colorTextPick.color,
      },
      swatch: {
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
                          className="row card p-2 mx-3 sm-text my-2"
                          onSubmit={handleSubmit}
                        >
                          <div className="col-12">
                            <div className="form-group mt-3">
                              <div className="mb-2">
                                <label
                                  htmlFor="siteName"
                                  className="control-label"
                                >
                                  {_t(t("Site's name"))}
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control sm-text"
                                  id="siteName"
                                  name="siteName"
                                  onChange={handleChange}
                                  value={newSettings.siteName}
                                  placeholder="e.g. Khadyo Restaurant"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group mt-4">
                              <div className="mb-2">
                                <label
                                  htmlFor="address"
                                  className="control-label"
                                >
                                  {_t(t("Address"))}
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control sm-text"
                                  id="address"
                                  name="address"
                                  onChange={handleChange}
                                  value={newSettings.address}
                                  placeholder="e.g. Type address"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group mt-4">
                              <div className="mb-2">
                                <label
                                  htmlFor="phnNo"
                                  className="control-label"
                                >
                                  {_t(t("Phone number"))}
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control sm-text"
                                  id="phnNo"
                                  name="phnNo"
                                  onChange={handleChange}
                                  value={newSettings.phnNo}
                                  placeholder="e.g. +8801xxx"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group mt-3">
                              <div className="mb-2">
                                <label className="control-label">
                                  {_t(t("Background of logo, clock"))}...
                                  <span className="text-danger">*</span>
                                  <span className="text-secondary ml-1">
                                    ({" "}
                                    {_t(
                                      t(
                                        "Please pick a color, click on the color below"
                                      )
                                    )}
                                    )
                                  </span>
                                </label>
                              </div>
                              <div className="row">
                                <div
                                  style={styles.swatch}
                                  onClick={handleClick}
                                  className="rounded-md col-12 col-md-3"
                                >
                                  <div
                                    style={styles.color}
                                    className="form-control"
                                  />
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
                            </div>

                            <div className="form-group mt-4">
                              <div className="mb-2">
                                <label className="control-label">
                                  {_t(t("Text color of currency, clock"))}...
                                  <span className="text-danger">*</span>
                                  <span className="text-secondary ml-1">
                                    ({" "}
                                    {_t(
                                      t(
                                        "Please pick a color, click on the color below"
                                      )
                                    )}
                                    )
                                  </span>
                                </label>
                              </div>
                              <div className="row">
                                <div
                                  style={stylesText.swatch}
                                  onClick={handleClickText}
                                  className="rounded-md col-12 col-md-3"
                                >
                                  <div
                                    style={stylesText.color}
                                    className="form-control"
                                  />
                                </div>
                                {colorTextPick.displayColorTextPicker && (
                                  <div style={stylesText.popover}>
                                    <div
                                      style={stylesText.cover}
                                      onClick={handleCloseText}
                                    />
                                    <SketchPicker
                                      color={colorTextPick.color}
                                      onChange={handleChangeColorText}
                                    />
                                  </div>
                                )}
                              </div>
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
                                  htmlFor="favicon"
                                  className="control-label"
                                >
                                  {_t(t("Favicon"))}
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="file"
                                  className="form-control sm-text"
                                  id="favicon"
                                  name="favicon"
                                  onChange={handleItemFavicon}
                                />
                              </div>
                            </div>

                            <div className="form-group mt-4">
                              <div className="mb-2">
                                <label htmlFor="vat" className="control-label">
                                  {_t(t("Vat"))} (%)
                                  <span className="text-danger">*</span>{" "}
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="form-control sm-text"
                                  id="vat"
                                  name="vat"
                                  onChange={handleChange}
                                  value={newSettings.vat}
                                  placeholder="e.g. Type vat %"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-check mt-4">
                              <input
                                type="checkbox"
                                className="form-check-input pointer-cursor"
                                id="print_kitchen_bill"
                                name="print_kitchen_bill"
                                onChange={() => {
                                  setNewSettings({
                                    ...newSettings,
                                    print_kitchen_bill:
                                      newSettings.print_kitchen_bill === 0
                                        ? 1
                                        : 0,
                                  });
                                }}
                                checked={newSettings.print_kitchen_bill === 1}
                              />
                              <label
                                className="form-check-label  pointer-cursor"
                                htmlFor="print_kitchen_bill"
                              >
                                {_t(t("Print order details in kitchen?"))}
                              </label>
                            </div>

                            <div className="form-check mt-4">
                              <input
                                type="checkbox"
                                className="form-check-input pointer-cursor"
                                id="play_sound"
                                name="play_sound"
                                onChange={() => {
                                  setNewSettings({
                                    ...newSettings,
                                    play_sound:
                                      newSettings.play_sound === 0 ? 1 : 0,
                                  });
                                }}
                                checked={newSettings.play_sound === 1}
                              />
                              <label
                                className="form-check-label pointer-cursor"
                                htmlFor="play_sound"
                              >
                                {_t(t("Play beep sound in POS?"))}
                              </label>
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

                            <div className="form-group mt-4 pb-2">
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
