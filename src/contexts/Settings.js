import React, { useState, useEffect } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

//3rd party packages

//creating context api
const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {
  // States hook  here
  const [loading, setLoading] = useState(true);
  const [languageList, setLanguageList] = useState([]);
  const [navLanguageList, setNavLanguageList] = useState([]);
  const [languageListForSearch, setLanguageListForSearch] = useState([]);

  //useEffect- to get data on page load
  useEffect(() => {
    getLanguages();
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

  // get languages & set pagination
  const setPaginatedLanguages = (pageNo) => {
    const langUrl = BASE_URL + "/settings/get-lang?page=" + pageNo;
    return axios
      .get(langUrl)
      .then((res) => {
        setLanguageList(res.data[0]);
      })
      .catch((error) => {});
  };

  return (
    <SettingsContext.Provider
      value={{
        loading,
        setLoading,
        languageList,
        setLanguageList,
        setPaginatedLanguages,
        navLanguageList,
        setNavLanguageList,
        languageListForSearch,
        setLanguageListForSearch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
