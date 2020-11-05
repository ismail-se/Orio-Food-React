import React, { useState, useEffect } from "react";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

//functions
import { getCookie } from "../functions/Functions";

//3rd party packages

// creating context api
const FoodContext = React.createContext();

const FoodProvider = ({ children }) => {
  // State hooks  here
  //loading
  const [loading, setLoading] = useState(false);
  const [dataPaginating, setDataPaginating] = useState(false);

  //Payment Type
  const [foodGroupList, setFoodGroupList] = useState(null);
  const [foodGroupForSearch, setFoodGroupforSearch] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getFoodGroup();
    }
  }, []);

  //get food groups
  const getFoodGroup = () => {
    setLoading(true);
    const foodGroupUrl = BASE_URL + "/settings/get-food-group";
    return axios
      .get(foodGroupUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setFoodGroupList(res.data[0]);
        setFoodGroupforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated food groups
  const setPaginatedFoodGroup = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-food-group?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setFoodGroupList(res.data[0]);
        setFoodGroupforSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  return (
    <FoodContext.Provider
      value={{
        //food group
        getFoodGroup,
        foodGroupList,
        setFoodGroupList,
        setPaginatedFoodGroup,
        foodGroupForSearch,
        setFoodGroupforSearch,

        //pagination
        dataPaginating,
        setDataPaginating,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export { FoodContext, FoodProvider };
