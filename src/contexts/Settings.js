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

  //useEffect- to get data on page load
  useEffect(() => {
    getLanguages();
  }, []);

  const getLanguages = () => {
    setLoading(true);
    const langUrl = BASE_URL + "/settings/get-lang";
    return axios.get(langUrl).then((res) => {
      setLanguageList(res.data);
      setLoading(false);
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        loading,
        setLoading,
        languageList,
        setLanguageList,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
