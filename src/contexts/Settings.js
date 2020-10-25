import React, { useState } from "react";

//creating context api
const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {
  // States hook  here
  const [languageList, setLanguageList] = useState([]);

  return (
    <SettingsContext.Provider value={{ languageList }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
