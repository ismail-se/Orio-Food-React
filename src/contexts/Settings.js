import React, { useState, useEffect } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

//functions
import { getCookie } from "../functions/Functions";

//3rd party packages

//creating context api
const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {
  // State hooks  here
  //loading
  const [loading, setLoading] = useState(false);
  const [dataPaginating, setDataPaginating] = useState(false);
  //languages
  const [languageList, setLanguageList] = useState(null);
  const [navLanguageList, setNavLanguageList] = useState(null);
  const [languageListForSearch, setLanguageListForSearch] = useState(null);

  //smtp
  const [smtp, setSmtp] = useState({
    MAIL_MAILER: null,
    MAIL_HOST: null,
    MAIL_PORT: null,
    MAIL_USERNAME: null,
    MAIL_PASSWORD: null,
    MAIL_ENCRYPTION: null,
    MAIL_FROM_ADDRESS: null,
    MAIL_FROM_NAME: null,
  });

  //permission group
  const [permissionGroup, setPermissionGroup] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated
    getLanguages();

    //call if authenticated
    if (getCookie() !== undefined) {
      getSmtp();
      getPermissionGroups();
    }
  }, []);

  //get all languages
  const getLanguages = () => {
    setLoading(true);
    const langUrl = BASE_URL + "/settings/get-lang";
    return axios.get(langUrl).then((res) => {
      setLanguageList(res.data[0]);
      setNavLanguageList(res.data[1]);
      setLanguageListForSearch(res.data[1]);
      setLoading(false);
    });
  };

  // get paginated languages
  const setPaginatedLanguages = (pageNo) => {
    setDataPaginating(true);
    const langUrl = BASE_URL + "/settings/get-lang?page=" + pageNo;
    return axios
      .get(langUrl)
      .then((res) => {
        setLanguageList(res.data[0]);
        setDataPaginating(false);
      })
      .catch((error) => {});
  };

  //get smtp settings
  const getSmtp = () => {
    setLoading(true);
    const smtpUrl = BASE_URL + "/settings/get-smtp";
    return axios
      .get(smtpUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setSmtp({
          ...smtp,
          MAIL_MAILER: res.data[0].MAIL_MAILER,
          MAIL_HOST: res.data[0].MAIL_HOST,
          MAIL_PORT: res.data[0].MAIL_PORT,
          MAIL_USERNAME: res.data[0].MAIL_USERNAME,
          MAIL_PASSWORD: res.data[0].MAIL_PASSWORD,
          MAIL_ENCRYPTION: res.data[0].MAIL_ENCRYPTION,
          MAIL_FROM_ADDRESS: res.data[0].MAIL_FROM_ADDRESS,
          MAIL_FROM_NAME: res.data[0].MAIL_FROM_NAME,
        });
        setLoading(false);
      });
  };

  //get permission groups
  const getPermissionGroups = () => {
    setLoading(true);
    const permissionGroupUrl = BASE_URL + "/settings/permission-group-list";
    return axios
      .get(permissionGroupUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setPermissionGroup(res.data[0]);
        setLoading(false);
      });
  };

  return (
    <SettingsContext.Provider
      value={{
        //common
        loading,
        setLoading,

        //languages
        languageList,
        setLanguageList,
        setPaginatedLanguages,
        navLanguageList,
        setNavLanguageList,
        languageListForSearch,
        setLanguageListForSearch,

        //smtp
        smtp,
        getSmtp,
        setSmtp,

        //permission group
        getPermissionGroups,
        permissionGroup,
        setPermissionGroup,

        //pagination
        dataPaginating,
        setDataPaginating,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
