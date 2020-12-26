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

  //foods
  const [foodList, setFoodList] = useState(null);
  const [foodForSearch, setFoodForSearch] = useState(null);

  //food group
  const [foodGroupList, setFoodGroupList] = useState(null);
  const [foodGroupForSearch, setFoodGroupforSearch] = useState(null);

  //food unit
  const [foodUnitList, setFoodUnitList] = useState(null);
  const [foodUnitForSearch, setFoodUnitforSearch] = useState(null);

  //variation
  const [variationList, setVariationList] = useState(null);
  const [variationForSearch, setVariationForSearch] = useState(null);

  //property Group
  const [propertyGroupList, setPropertyGroupList] = useState(null);
  const [propertyGroupForSearch, setPropertyGroupForSearch] = useState(null);

  //property Item
  const [propertyItemList, setPropertyItemList] = useState(null);
  const [propertyItemForSearch, setPropertyItemForSearch] = useState(null);
  const [propertyItemGroup, setPropertyItemGroup] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getFood();
      getFoodGroup();
      getFoodUnit();
      getVariation();
      getPropertyGroup();
    }
  }, []);

  //get foods
  const getFood = () => {
    setLoading(true);
    const foodItemUrl = BASE_URL + "/settings/get-food-item";
    return axios
      .get(foodItemUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setFoodList(res.data[0]);
        setFoodForSearch(res.data[1]);
      });
  };

  // get paginated food
  const setPaginatedFood = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-food-item?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setFoodList(res.data[0]);
        setFoodForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

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
        setVariationForSearch(res.data[1]);
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
        setVariationForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get property group
  const getPropertyGroup = () => {
    setLoading(true);
    const propertyGroupUrl = BASE_URL + "/settings/get-property-group";
    return axios
      .get(propertyGroupUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setPropertyGroupList(res.data[0]);
        setPropertyGroupForSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated property group
  const setPaginatedPropertyGroup = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-property-group?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setPropertyGroupList(res.data[0]);
        setPropertyGroupForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get property item
  const getPropertyItem = (slug) => {
    setLoading(true);
    const propertyItemUrl = BASE_URL + "/settings/get-property-item/" + slug;
    return axios
      .get(propertyItemUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setPropertyItemList(res.data[0]);
        setPropertyItemForSearch(res.data[0]);
        setPropertyItemGroup(res.data[1]);
        setLoading(false);
      });
  };

  return (
    <FoodContext.Provider
      value={{
        // common
        loading,
        setLoading,

        //food
        getFood,
        foodList,
        setFoodList,
        setPaginatedFood,
        foodForSearch,
        setFoodForSearch,

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
        setVariationForSearch,

        //property group
        getPropertyGroup,
        propertyGroupList,
        setPropertyGroupList,
        setPaginatedPropertyGroup,
        propertyGroupForSearch,
        setPropertyGroupForSearch,

        //property Item
        getPropertyItem,
        propertyItemList,
        setPropertyItemList,
        propertyItemForSearch,
        setPropertyItemForSearch,
        propertyItemGroup,
        setPropertyItemGroup,

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
