import React, { useState, useEffect } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

//functions
import { getCookie } from "../functions/Functions";

//3rd party packages

// creating context api
const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  // State hooks  here
  //loading
  const [loading, setLoading] = useState(false);
  const [dataPaginating, setDataPaginating] = useState(false);

  // Signup
  const [signUpInfo, setSignUpInfo] = useState({
    name: "Akash",
    email: null,
    password: null,
  });

  // auth user
  const [authUserInfo, setAuthUserInfo] = useState({
    details: null,
    permissions: null,
  });

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getAuthUser();
    }
  }, []);

  //get authenticated user
  const getAuthUser = () => {
    setLoading(true);
    const langUrl = BASE_URL + "/auth/user";
    return axios
      .get(langUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setAuthUserInfo({
          ...authUserInfo,
          details: res.data[0],
          permissions: res.data[1],
        });
        setLoading(false);
      })
      .catch(() => {});
  };

  return (
    <UserContext.Provider
      value={{ getAuthUser, setAuthUserInfo, authUserInfo, signUpInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
