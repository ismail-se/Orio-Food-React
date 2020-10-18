import React, { useState } from "react";

// creating context api
const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  // States hook  here
  const [signUpInfo, setSignUpInfo] = useState({
    name: "Akash",
    email: null,
    password: null,
  });

  return (
    <UserContext.Provider value={{ signUpInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
