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

  // auth user
  const [authUserInfo, setAuthUserInfo] = useState({
    details: null,
    permissions: null,
  });

  //waiter
  const [waiterList, setWaiterList] = useState(null);
  const [waiterForSearch, setWaiterforSearch] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getAuthUser();
      getWaiter();
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

  //get waiter
  const getWaiter = () => {
    setLoading(true);
    const waiterUrl = BASE_URL + "/settings/get-waiter";
    return axios
      .get(waiterUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setWaiterList(res.data[0]);
        setWaiterforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated waiter
  const setPaginatedWaiter = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-waiter?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setWaiterList(res.data[0]);
        setWaiterforSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  return (
    <UserContext.Provider
      value={{
        //auth user
        getAuthUser,
        setAuthUserInfo,
        authUserInfo,

        //waiter
        getWaiter,
        waiterList,
        setWaiterList,
        setPaginatedWaiter,
        waiterForSearch,
        setWaiterforSearch,

        //pagination
        dataPaginating,
        setDataPaginating,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
