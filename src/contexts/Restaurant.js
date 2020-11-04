import React, { useState, useEffect } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

//functions
import { getCookie } from "../functions/Functions";

//3rd party packages

// creating context api
const RestaurantContext = React.createContext();

const RestaurantProvider = ({ children }) => {
  // State hooks  here
  //loading
  const [loading, setLoading] = useState(false);
  const [dataPaginating, setDataPaginating] = useState(false);

  //branch
  const [branchList, setBranchList] = useState(null);
  const [branchForSearch, setBranchforSearch] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getBranch();
    }
  }, []);

  //get branch
  const getBranch = () => {
    setLoading(true);
    const branchUrl = BASE_URL + "/settings/get-branch";
    return axios
      .get(branchUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setBranchList(res.data[0]);
        setBranchforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated branch
  const setPaginatedBranch = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-branch?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setBranchList(res.data[0]);
        setBranchforSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  return (
    <RestaurantContext.Provider
      value={{
        //branch
        getBranch,
        branchList,
        setBranchList,
        setPaginatedBranch,
        branchForSearch,
        setBranchforSearch,

        //pagination
        dataPaginating,
        setDataPaginating,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export { RestaurantContext, RestaurantProvider };
