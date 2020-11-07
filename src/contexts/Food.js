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

  //food group
  const [foodGroupList, setFoodGroupList] = useState(null);
  const [foodGroupForSearch, setFoodGroupforSearch] = useState(null);

  //food unit
  const [foodUnitList, setFoodUnitList] = useState(null);
  const [foodUnitForSearch, setFoodUnitforSearch] = useState(null);

  //variation
  const [variationList, setVariationList] = useState(null);
  const [variationForSearch, setVariationforSearch] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getFoodGroup();
      getFoodUnit();
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

  //get food units
  const getFoodUnit = () => {
    setLoading(true);
    const foodUnitUrl = BASE_URL + "/settings/get-food-unit";
    return axios
      .get(foodUnitUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setFoodUnitList(res.data[0]);
        setFoodUnitforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated food units
  const setPaginatedFoodUnit = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-food-unit?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setFoodUnitList(res.data[0]);
        setFoodUnitforSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get variations
  const getVariation = () => {
    setLoading(true);
    const variationUrl = BASE_URL + "/settings/get-variation";
    return axios
      .get(variationUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setVariationList(res.data[0]);
        setVariationforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated variations
  const setPaginatedVariation = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-variation?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setVariationList(res.data[0]);
        setVariationforSearch(res.data[1]);
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

        //food units
        getFoodUnit,
        foodUnitList,
        setFoodUnitList,
        setPaginatedFoodUnit,
        foodUnitForSearch,
        setFoodUnitforSearch,

        //variation
        getVariation,
        variationList,
        setVariationList,
        setPaginatedVariation,
        variationForSearch,
        setVariationforSearch,

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
