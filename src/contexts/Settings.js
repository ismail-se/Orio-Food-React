import React, { useState, useEffect } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

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

  //useEffect- to get data on page render
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

  return (
    <SettingsContext.Provider
      value={{
        loading,
        setLoading,
        languageList,
        setLanguageList,
        setPaginatedLanguages,
        dataPaginating,
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
