import React, { useContext, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";

//axios and base url
import axios from "axios";
import { BASE_URL } from "../../../../BaseUrl";

//functions
import {
  _t,
  getCookie,
  currencySymbolLeft,
  formatPrice,
  currencySymbolRight,
  getSystemSettings,
} from "../../../../functions/Functions";
import { useTranslation } from "react-i18next";

//3rd party packages
import { Helmet } from "react-helmet";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
import { useReactToPrint } from "react-to-print";

//importing context consumer here
import { UserContext } from "../../../../contexts/User";
import { SettingsContext } from "../../../../contexts/Settings";
import { RestaurantContext } from "../../../../contexts/Restaurant";
import { FoodContext } from "../../../../contexts/Food";
import Calculator from "./calc/Calculator";

const Pos = () => {
  //getting context values here
  const {
    //common
    loading,
    setLoading,
    generalSettings,
  } = useContext(SettingsContext);

  const {
    authUserInfo,
    //customer
    customerForSearch,
    setCustomerForSearch,
    //waiter
    waiterForSearch,
  } = useContext(UserContext);

  const {
    //food
    foodForSearch,
    //food group
    foodGroupForSearch,
    //property group
    propertyGroupForSearch,
  } = useContext(FoodContext);

  const {
    //work period
    workPeriodForSearch,
    //branch
    branchForSearch,
    //table
    tableForSearch,
    //dept-tag
    deptTagForSearch,
    //payment-type
    paymentTypeForSearch,
  } = useContext(RestaurantContext);

  const { t } = useTranslation();

  // State hooks here
  const [foodItem, setFoodItem] = useState({
    foodGroup: null,
    items: null,
    selectedItem: null,
    variations: null,
    properties: null,
  });

  //calculator
  const [calculatorMenu, setCalculatorMenu] = useState(false);
  //new order
  const [newOrder, setNewOrder] = useState(null);
  //active index of order list
  const [activeItemInOrder, setActiveItemInOrder] = useState(null);
  //checked variations
  const [selectedVariation, setSelectedVariation] = useState([]);
  //selected groups
  const [selectedPropertyGroup, setSelectedPropertyGroup] = useState([]);
  //checked properties
  const [selectedProperties, setSelectedProperties] = useState([]);

  //the sub total
  const [theSubTotal, setTheSubTotal] = useState(0);
  //total payable
  const [totalPayable, setTotalPaybale] = useState(0);
  // paidMoney
  const [paidMoney, setPaidMoney] = useState(0);
  //return
  const [returnMoneyUsd, setReturnMoneyUsd] = useState(0);

  //vat
  const [theVat, setTheVat] = useState(0);

  //vat settings
  const [newSettings, setNewSettings] = useState(null);

  //order details users
  const [orderDetailUsers, setOrderDetailusers] = useState({
    theCustomers: null,
    theTables: null,
    theWaiters: null,
  });

  //order details
  const [orderDetails, setOrderDetails] = useState({
    branch: null,
    customer: null,
    table: null,
    waiter: null,
    dept_tag: null,
    payment_type: null,
    payment_amount: null,
    total_guest: 1,
    newCustomer: false,
    newCustomerInfo: {
      name: "",
      number: "",
    },
    token: null,
    serviceCharge: 0,
    discount: 0,
  });

  //useEffect- to get data on render
  useEffect(() => {
    if (foodGroupForSearch) {
      let tempItems =
        foodForSearch &&
        foodForSearch.filter((tempItem) => {
          return parseInt(tempItem.food_group_id) === foodGroupForSearch[0].id;
        });
      if (tempItems && tempItems.length > 0) {
        // initial group & item being active here, variations, properties
        setFoodItem({
          foodGroup: foodGroupForSearch[0],
          items: tempItems,
          selectedItem: tempItems[0],
          variations:
            parseInt(tempItems[0].has_variation) === 1
              ? tempItems[0].variations
              : null,
          properties:
            parseInt(tempItems[0].has_property) === 1
              ? tempItems[0].properties
              : null,
        });
      }
    }

    if (authUserInfo.details) {
      let theBranch =
        branchForSearch &&
        branchForSearch.find((branch) => {
          return authUserInfo.details.branch_id === branch.id;
        });
      setOrderDetails({
        ...orderDetails,
        branch: theBranch !== undefined ? theBranch : null,
      });

      //set work period
      let theWorkPeriod = null;
      if (theBranch !== undefined) {
        theWorkPeriod =
          workPeriodForSearch &&
          workPeriodForSearch.filter((tempWorkPeriod) => {
            return theBranch.id === parseInt(tempWorkPeriod.branch_id);
          });

        //filter it with ended_at === null;
        theWorkPeriod =
          theWorkPeriod &&
          theWorkPeriod.find((endAtNullItem) => {
            return endAtNullItem.ended_at === null;
          });
      }
      //set work period here
      setNewSettings({
        ...newSettings,
        vat: generalSettings && getSystemSettings(generalSettings, "type_vat"),
        workPeriod: theWorkPeriod !== undefined ? theWorkPeriod : null,
      });
    } else {
      // user type admin
      setNewSettings({
        ...newSettings,
        vat: generalSettings && getSystemSettings(generalSettings, "type_vat"),
      });
    }
    setOrderDetailusers({
      theCustomers: customerForSearch ? customerForSearch : null,
      theTables: tableForSearch ? tableForSearch : null,
      theWaiters: waiterForSearch ? waiterForSearch : null,
    });
  }, [authUserInfo, waiterForSearch]);

  //add new item to order list
  const handleOrderItem = (tempFoodItem) => {
    let oldOrderItems = [];
    let newOrderItem = null;
    let tempSelectedVariations = [];
    if (newOrder) {
      newOrder.map((eachOldOrderItem) => {
        //push all old items to new array to setNewOrder
        oldOrderItems.push(eachOldOrderItem);

        //set selected variations of each order item
        let tempArray = [];
        if (eachOldOrderItem.variation !== null) {
          tempArray.push(eachOldOrderItem.variation.food_with_variation_id);
        } else {
          tempArray.push(null);
        }
        tempSelectedVariations.push(tempArray);
      });
      //add new order item
      newOrderItem = {
        item: tempFoodItem,
        variation:
          parseInt(tempFoodItem.has_variation) === 1
            ? tempFoodItem.variations[0]
            : null,
        quantity: 1,
      };
      //set selected variations of new item
      let tempArray = [];
      if (parseInt(tempFoodItem.has_variation) === 1) {
        tempArray.push(tempFoodItem.variations[0].food_with_variation_id);
      } else {
        tempArray.push(null);
      }
      tempSelectedVariations.push(tempArray);
      //push new item to new array to setNewOrder
      oldOrderItems.push(newOrderItem);
    } else {
      //if no item in newOrder List
      setOrderDetails({
        //set token here on first order item add,
        ...orderDetails,
        token: {
          time: new Date().getTime(),
          id: Math.floor(1000 + Math.random() * 9000),
        },
      });
      newOrderItem = {
        //add new order item
        item: tempFoodItem,
        variation:
          parseInt(tempFoodItem.has_variation) === 1
            ? tempFoodItem.variations[0]
            : null,
        quantity: 1,
      };

      //set selected variations of new item
      let tempArray = [];
      if (parseInt(tempFoodItem.has_variation) === 1) {
        tempArray.push(tempFoodItem.variations[0].food_with_variation_id);
      } else {
        tempArray.push(null);
      }
      tempSelectedVariations.push(tempArray);

      //push new item to new array to setNewOrder
      oldOrderItems.push(newOrderItem);
    }

    //set new order list with new array of all order items
    setNewOrder(oldOrderItems);

    //set order list active item index to add class "actve"
    setActiveItemInOrder(oldOrderItems.length - 1);

    //set selected variations
    setSelectedVariation(tempSelectedVariations);

    //calculate subTotalPrice
    totalPrice(oldOrderItems);
    //sound
    if (getSystemSettings(generalSettings, "play_sound") === "1") {
      let beep = document.getElementById("myAudio");
      beep.play();
    }
  };

  //set order item's variation on change of variation
  const handleOrderItemVariation = (tempFoodItemVariation) => {
    if (activeItemInOrder !== null) {
      if (newOrder) {
        let oldOrderItems = []; //array to push order items
        let newOrderItemTemp = null; //to edit selected item
        let tempSelectedVariations = []; //to set selected variations array for order items
        newOrder.map((newOrderItem, index) => {
          let tempArray = [];
          if (index === activeItemInOrder) {
            //changing variation of selected food item
            newOrderItemTemp = {
              ...newOrderItem,
              variation: tempFoodItemVariation,
            };
            //push updated item to orderlist
            oldOrderItems.push(newOrderItemTemp);

            //set updated variation for selected variation
            tempArray.push(tempFoodItemVariation.food_with_variation_id);
          } else {
            //set other items as it was which are not selected to edit
            newOrderItemTemp = newOrderItem;
            oldOrderItems.push(newOrderItemTemp);
            if (newOrderItemTemp.variation) {
              //set updated variation for selected variations
              tempArray.push(newOrderItemTemp.variation.food_with_variation_id);
            }
          }

          //push to the array to set selectedVariations
          tempSelectedVariations.push(tempArray);
        });
        //set variations here
        setSelectedVariation(tempSelectedVariations);

        //set updated order list
        setNewOrder(oldOrderItems);

        //calculate subTotalPrice
        totalPrice(oldOrderItems);
      }
    }
  };

  //to check which variation is selected
  const checkChecked = (variationItem) => {
    //if variationItem.food_with_variation_id of selected item exist in selectedVariation - return true
    if (selectedVariation[activeItemInOrder] !== undefined) {
      if (
        selectedVariation[activeItemInOrder][0] ===
        variationItem.food_with_variation_id
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  //delete confirmation modal of item from order list
  const handleDeleteConfirmation = (removeIndex) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="card card-body">
            <h1>{_t(t("Are you sure?"))}</h1>
            <p className="text-center">{_t(t("You want to delete this?"))}</p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleRemoveItemFromOrderList(removeIndex);
                  onClose();
                }}
              >
                {_t(t("Yes, delete it!"))}
              </button>
              <button className="btn btn-success ml-2 px-3" onClick={onClose}>
                {_t(t("No"))}
              </button>
            </div>
          </div>
        );
      },
    });
  };

  //remove item from order list
  const handleRemoveItemFromOrderList = (removeIndex) => {
    let oldOrderItems = []; //array to push order items
    newOrder.map((newOrderItem, index) => {
      if (index !== removeIndex) {
        //push item to orderlist
        oldOrderItems.push(newOrderItem);
      }
    });

    //delete variations here
    let tempSelectedVariations = selectedVariation.filter(
      (selectedVariationItem, variationIndex) => {
        return variationIndex !== removeIndex;
      }
    );
    //delete properties here
    let tempSelectedProperties = selectedProperties.filter(
      (selectedPropertyItem, propertyIndex) => {
        return propertyIndex !== removeIndex;
      }
    );

    //delete property group here
    let tempSelectedPropertyGroup = selectedPropertyGroup.filter(
      (selectedPropertyGroupItem, propertyGroupIndex) => {
        return propertyGroupIndex !== removeIndex;
      }
    );

    //set property group here
    setSelectedPropertyGroup(tempSelectedPropertyGroup);

    //set variations here
    setSelectedVariation(tempSelectedVariations);

    //set properties here
    setSelectedProperties(tempSelectedProperties);

    //set updated order list
    setNewOrder(oldOrderItems);

    //set active item in order list
    setActiveItemInOrder(null);

    //calculate subTotalPrice
    totalPrice(oldOrderItems);
    //sound
    if (getSystemSettings(generalSettings, "play_sound") === "1") {
      let beep = document.getElementById("myAudio");
      beep.play();
    }
  };

  //handle order item quantity
  const handleOrderItemQty = (action) => {
    if (activeItemInOrder !== null) {
      if (newOrder) {
        let newOrderItemTemp = null; //to edit selected item
        let oldOrderItems = []; //array to push order items
        newOrder.map((newOrderItem, index) => {
          if (index === activeItemInOrder) {
            //update qty here
            if (action === "+") {
              //increase qty
              newOrderItemTemp = {
                ...newOrderItem,
                quantity: newOrderItem.quantity + 1,
              };
            } else {
              //if qty !==1 decrease
              if (newOrderItem.quantity !== 1) {
                newOrderItemTemp = {
                  ...newOrderItem,
                  quantity: newOrderItem.quantity - 1,
                };
              } else {
                newOrderItemTemp = {
                  ...newOrderItem,
                  quantity: newOrderItem.quantity,
                };
              }
            }
            oldOrderItems.push(newOrderItemTemp);
          } else {
            // set other items as it was which are not selected to edit
            oldOrderItems.push(newOrderItem);
          }
        });

        //calculate subTotalPrice
        totalPrice(oldOrderItems);
        //set updated order list
        setNewOrder(oldOrderItems);
      }
    }
  };

  //cancel order confirmation
  const handleCancelConfirmation = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="card card-body bg-primary text-white">
            <h1 className="text-white">{_t(t("Are you sure?"))}</h1>
            <p className="text-center">
              {_t(t("You want to cancel this order?"))}
            </p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-warning text-dark"
                onClick={() => {
                  handleCancel();
                  onClose();
                }}
              >
                {_t(t("Yes!"))}
              </button>
              <button className="btn btn-success ml-2 px-3" onClick={onClose}>
                {_t(t("No"))}
              </button>
            </div>
          </div>
        );
      },
    });
  };

  //cancel order
  const handleCancel = () => {
    setLoading(true);
    setNewOrder(null);
    setActiveItemInOrder(null);
    setSelectedVariation([]);
    setSelectedPropertyGroup([]);
    setSelectedProperties([]);
    setTheSubTotal(0);
    setTheVat(0);
    setTotalPaybale(0);
    setReturnMoneyUsd(0);
    setPaidMoney(0);
    setOrderDetails({
      branch: orderDetails.branch,
      customer: null,
      table: null,
      waiter: null,
      dept_tag: null,
      payment_type: null,
      payment_amount: null,
      total_guest: 1,
      newCustomer: false,
      newCustomerInfo: {
        name: "",
        number: "",
      },
      token: null,
      serviceCharge: 0,
      discount: 0,
    });
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  //add properties
  const handleAddProperties = (property) => {
    let propertyItem = {
      item: property,
      quantity: 1,
    };
    if (activeItemInOrder !== null) {
      if (newOrder) {
        let oldOrderItems = []; //array to push order items
        let newOrderItemTemp = null; //to edit selected item

        let tempSelectedProperties = []; //to set selected properties array for order items
        let tempSelectedPropertyGroup = []; //to set selected property group array for order items properties

        newOrder.map((newOrderItem, index) => {
          let tempArray = []; //for selected properties
          let tempArrayPropertyGroup = []; //for selected property groups

          if (index === activeItemInOrder) {
            let tempPropertyArray = []; //for property items
            if (newOrderItem.properties) {
              newOrderItem.properties.map((eachPropertyItem) => {
                tempPropertyArray.push(eachPropertyItem);
                //set updated property for selected variation
                tempArray.push(eachPropertyItem.item.id);

                //handle selected property group
                tempArrayPropertyGroup.push(
                  eachPropertyItem.item.property_group_id
                );
              });
              tempPropertyArray.push(propertyItem);
              //for selected properties
              tempArray.push(propertyItem.item.id);
              //handle selected property group
              tempArrayPropertyGroup.push(propertyItem.item.property_group_id);
            } else {
              tempPropertyArray.push(propertyItem);
              //for selected properties
              tempArray.push(propertyItem.item.id);
              //handle selected property group
              tempArrayPropertyGroup.push(propertyItem.item.property_group_id);
            }

            //changing properties of selected food item
            newOrderItemTemp = {
              ...newOrderItem,
              properties: tempPropertyArray,
            };
            //push updated item to orderlist
            oldOrderItems.push(newOrderItemTemp);
          } else {
            // set other items as it was which are not selected to edit
            newOrderItemTemp = newOrderItem;
            oldOrderItems.push(newOrderItemTemp);
            if (newOrderItem.properties) {
              newOrderItem.properties.map((eachPropertyItem) => {
                //set updated properties for selected properties
                tempArray.push(eachPropertyItem.item.id);

                //set updated property groups for selected groups
                tempArrayPropertyGroup.push(
                  eachPropertyItem.item.property_group_id
                );
              });
            }
          }
          //push to the array to set selected properties
          tempSelectedProperties.push(tempArray);
          //push to the array to set selected property groups
          tempSelectedPropertyGroup.push(tempArrayPropertyGroup);
        });

        //set selected properties here
        setSelectedProperties(tempSelectedProperties);

        //handle selected property groups
        let newSelectedPropertyGroup = [];
        tempSelectedPropertyGroup.map((eachSelectedGroupArray) => {
          let unique = [...new Set(eachSelectedGroupArray)];
          newSelectedPropertyGroup.push(unique);
        });
        //set selected property groups here
        setSelectedPropertyGroup(newSelectedPropertyGroup);

        //calculate subTotalPrice
        totalPrice(oldOrderItems);
        //set updated order list
        setNewOrder(oldOrderItems);
      }
    }
  };

  //remove properties
  const handleRemoveProperties = (propertyItem) => {
    if (activeItemInOrder !== null) {
      if (newOrder) {
        let oldOrderItems = []; //array to push order items
        let newOrderItemTemp = null; //to edit selected item
        let newSelectedProperties = []; //for selected properties
        let allPropertyGroups = []; //for selected property groups

        newOrder.map((newOrderItem, index) => {
          if (index === activeItemInOrder) {
            let tempPropertyArray = []; //for property items
            if (newOrderItem.properties) {
              newOrderItem.properties.map((eachPropertyItem) => {
                if (eachPropertyItem.item.id !== propertyItem.id) {
                  tempPropertyArray.push(eachPropertyItem);
                }
              });

              //removing properties from selected properties array
              selectedProperties.map((selectedProperty, propertyIndex) => {
                if (propertyIndex !== activeItemInOrder) {
                  //pushing other order items properties in selected array
                  newSelectedProperties.push(selectedProperty);
                } else {
                  let theProperties = selectedProperty.filter((filterThis) => {
                    return filterThis !== propertyItem.id;
                  });
                  //pushing this order items properties in selected array or [] if not a single property item is selected
                  newSelectedProperties.push(theProperties);
                }
              });
            }

            //changing properties of selected food item
            newOrderItemTemp = {
              ...newOrderItem,
              properties: tempPropertyArray,
            };

            //set selected properties here
            setSelectedProperties(newSelectedProperties);
            //push updated item to orderlist
            oldOrderItems.push(newOrderItemTemp);

            //property group for selected property group array
            selectedPropertyGroup.map((groupItem, groupItemIndex) => {
              if (index === groupItemIndex) {
                let tempGroupArray = []; // for selected group of each order item (index of array wise new array)
                groupItem.map((filterThisItem) => {
                  if (filterThisItem !== propertyItem.property_group_id) {
                    //push if removable property item's group !== groupItem
                    tempGroupArray.push(filterThisItem);
                  }
                });

                //push all groups of modified new properties array of this item
                tempPropertyArray.map((pushThis) => {
                  tempGroupArray.push(pushThis.item.property_group_id);
                });

                //remove duplicate groups
                let unique = [...new Set(tempGroupArray)];
                allPropertyGroups.push(unique);
              } else {
                //keep other selected groups as it was
                allPropertyGroups.push(groupItem);
              }
            });
          } else {
            // set other items as it was which are not selected to edit
            newOrderItemTemp = newOrderItem;
            oldOrderItems.push(newOrderItemTemp);
          }
        });

        //set new selected property groups
        setSelectedPropertyGroup(allPropertyGroups);

        //calculate subTotalPrice
        totalPrice(oldOrderItems);

        //set updated order list
        setNewOrder(oldOrderItems);
      }
    }
  };

  //to check which property is selected
  const checkCheckedProperties = (propertyItem) => {
    //if property.id of selected item exist in selected properties - return true
    if (selectedProperties[activeItemInOrder] !== undefined) {
      if (selectedProperties[activeItemInOrder].includes(propertyItem.id)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  //handle property quantity
  const handlePropertyQty = (propertyItem, action) => {
    if (activeItemInOrder !== null) {
      if (newOrder) {
        let newOrderItemTemp = null; //to edit selected item
        let oldOrderItems = []; //array to push order items
        let tempPropertyItemsArray = []; //for each property items
        newOrder.map((newOrderItem, index) => {
          if (index === activeItemInOrder) {
            //if has property items
            if (newOrderItem.properties) {
              newOrderItem.properties.map((eachPropertyItem) => {
                //loop through the properties to change the specific one's quantity and keep the rest as it was
                if (eachPropertyItem.item.id !== propertyItem.id) {
                  //keep others as it was
                  tempPropertyItemsArray.push(eachPropertyItem);
                } else {
                  //coming here if the specific item's id === selected property item's id
                  let newPropertyItemForQtyUpdate = null;
                  //update qty here
                  if (action === "+") {
                    //increase qty
                    newPropertyItemForQtyUpdate = {
                      ...eachPropertyItem,
                      quantity: eachPropertyItem.quantity + 1,
                    };
                    tempPropertyItemsArray.push(newPropertyItemForQtyUpdate);
                  } else {
                    //if qty !==1 decrease
                    if (eachPropertyItem.quantity !== 1) {
                      newPropertyItemForQtyUpdate = {
                        ...eachPropertyItem,
                        quantity: eachPropertyItem.quantity - 1,
                      };
                      tempPropertyItemsArray.push(newPropertyItemForQtyUpdate);
                    } else {
                      tempPropertyItemsArray.push(eachPropertyItem);
                    }
                  }
                }
              });
              //changing properties of selected food item
              newOrderItemTemp = {
                ...newOrderItem,
                properties: tempPropertyItemsArray,
              };
              //push updated item to orderlist
              oldOrderItems.push(newOrderItemTemp);
            } else {
              //push updated item to orderlist
              oldOrderItems.push(newOrderItem);
            }
          } else {
            // set other items as it was which are not selected to edit
            oldOrderItems.push(newOrderItem);
          }
        });

        //calculate subTotalPrice
        totalPrice(oldOrderItems);
        //set updated order list
        setNewOrder(oldOrderItems);
      }
    }
  };

  //to check selected property item's quantity
  const checkCheckedPropertyQuantity = (propertyItem) => {
    //if propertyItem.id of selected item exist in selectedProperties - return the quantity of that property item from the order list item
    if (selectedProperties[activeItemInOrder] !== undefined) {
      if (selectedProperties[activeItemInOrder].includes(propertyItem.id)) {
        //get order of activeItemInOrder index
        if (newOrder) {
          if (newOrder[activeItemInOrder] !== undefined) {
            let orderItem = newOrder[activeItemInOrder];
            let theItem = orderItem.properties.find((theItemTemp) => {
              return theItemTemp.item.id === propertyItem.id;
            });
            return theItem.quantity;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  };

  //show price of each item in order list
  const showPriceOfEachOrderItem = (itemIndex) => {
    if (newOrder) {
      let price = 0;
      let orderItem = newOrder[itemIndex];
      //check price * quantity (variation price / item price)
      if (parseInt(orderItem.item.has_variation) === 1) {
        price = parseFloat(orderItem.variation.food_with_variation_price);
      } else {
        price = parseFloat(orderItem.item.price);
      }

      //calculate total price of properties
      if (orderItem.properties) {
        if (orderItem.properties.length > 0) {
          orderItem.properties.map((getEachItemPrice) => {
            let totalPropertyPrice =
              parseFloat(getEachItemPrice.item.extra_price) *
              getEachItemPrice.quantity;
            price = price + totalPropertyPrice;
          });
        }
      }

      let formattedPrice = formatPrice(price * orderItem.quantity);
      return formattedPrice;
    }
  };

  //show total price
  const totalPrice = (allOrderItems) => {
    let subTotal = 0;
    allOrderItems.map((orderItem) => {
      let price = 0;
      //check price * quantity (variation price / item price)
      if (parseInt(orderItem.item.has_variation) === 1) {
        price = parseFloat(orderItem.variation.food_with_variation_price);
      } else {
        price = parseFloat(orderItem.item.price);
      }

      //calculate total price of properties
      if (orderItem.properties) {
        if (orderItem.properties.length > 0) {
          orderItem.properties.map((getEachItemPrice) => {
            let totalPropertyPrice =
              parseFloat(getEachItemPrice.item.extra_price) *
              getEachItemPrice.quantity;
            price = price + totalPropertyPrice;
          });
        }
      }
      subTotal = subTotal + price * orderItem.quantity;
    });
    setTheSubTotal(subTotal);

    let tempVat = 0;
    if (newSettings) {
      tempVat = (subTotal * parseFloat(newSettings.vat)) / 100;
      setTheVat(tempVat);
    }

    let totalPayable = 0;
    let localCurrency = JSON.parse(localStorage.getItem("currency"));
    let usdServiceCharge =
      parseFloat(orderDetails.serviceCharge) / localCurrency.rate;
    let usdDiscount = parseFloat(orderDetails.discount) / localCurrency.rate;

    totalPayable = subTotal + tempVat + usdServiceCharge - usdDiscount;
    setTotalPaybale(totalPayable);

    //calculate paid amount to set return amount
    handleCalculatePaid(orderDetails.payment_amount, orderDetails.payment_type);
  };

  //search food here
  const handleSearch = (e) => {
    setActiveItemInOrder(null);
    let searchInput = e.target.value.toLowerCase();
    let searchedList = foodForSearch.filter((item) => {
      let lowerCaseItemName = item.name.toLowerCase();
      let lowerCaseItemGroup = item.food_group.toLowerCase();
      return (
        lowerCaseItemName.includes(searchInput) ||
        lowerCaseItemGroup.includes(searchInput)
      );
    });
    setFoodItem({
      foodGroup: null,
      items: searchedList.length > 0 ? searchedList : null,
      selectedItem: null,
      variations: null,
      properties: null,
    });
  };

  //set order detals additional info here
  //set branch
  const handleSetBranch = (branch) => {
    setLoading(true);
    let tempCustomers = customerForSearch.filter((eachCustomer) => {
      return eachCustomer.branch_id === branch.id;
    });
    let tempTables = tableForSearch.filter((eachTable) => {
      return eachTable.branch_id === branch.id;
    });
    let tempWaiters = waiterForSearch.filter((eachWaiter) => {
      return eachWaiter.branch_id === branch.id;
    });
    setOrderDetailusers({
      theCustomers: tempCustomers,
      theTables: tempTables,
      theWaiters: tempWaiters,
    });

    setNewOrder(null);
    setActiveItemInOrder(null);
    setSelectedVariation([]);
    setSelectedPropertyGroup([]);
    setSelectedProperties([]);
    setTheSubTotal(0);
    setTheVat(0);
    setTotalPaybale(0);
    setReturnMoneyUsd(0);
    setPaidMoney(0);
    setOrderDetails({
      branch: branch,
      customer: null,
      table: null,
      waiter: null,
      dept_tag: null,
      payment_type: null,
      payment_amount: null,
      total_guest: 1,
      newCustomer: false,
      newCustomerInfo: {
        name: "",
        number: "",
      },
      token: null,
      serviceCharge: 0,
      discount: 0,
    });
    // set work period according to branch for admin on branch change
    let theWorkPeriod = null;
    theWorkPeriod =
      workPeriodForSearch &&
      workPeriodForSearch.filter((tempWorkPeriod) => {
        return branch.id === parseInt(tempWorkPeriod.branch_id);
      });

    theWorkPeriod = theWorkPeriod.find((endAtNullItem) => {
      return endAtNullItem.ended_at === null;
    });
    setNewSettings({
      ...newSettings,
      workPeriod: theWorkPeriod !== undefined ? theWorkPeriod : null,
      vat: newSettings.vat,
    });

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  //customer
  const handleSetCustomer = (customer) => {
    setOrderDetails({
      ...orderDetails,
      customer,
    });
  };

  //new Customer
  const handleNewCustomer = (e) => {
    //if name is not there, set new customer === false
    if (e.target.name === "name") {
      if (e.target.value.length > 0) {
        setOrderDetails({
          ...orderDetails,
          newCustomer: true,
          newCustomerInfo: {
            ...orderDetails.newCustomerInfo,
            [e.target.name]: e.target.value,
          },
        });
      } else {
        setOrderDetails({
          ...orderDetails,
          newCustomer: false,
          newCustomerInfo: {
            ...orderDetails.newCustomerInfo,
            [e.target.name]: e.target.value,
          },
        });
      }
    } else {
      //set phn number here
      setOrderDetails({
        ...orderDetails,
        newCustomerInfo: {
          ...orderDetails.newCustomerInfo,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  //  table
  const handleSetTable = (table) => {
    setOrderDetails({
      ...orderDetails,
      table,
    });
  };

  // waiter
  const handleSetWaiter = (waiter) => {
    setOrderDetails({
      ...orderDetails,
      waiter,
    });
  };

  // department tag
  const handleSetDeptTag = (dept_tag) => {
    setOrderDetails({
      ...orderDetails,
      dept_tag,
    });
  };

  //payment type
  const handleSetpaymentType = (payment_type) => {
    setOrderDetails({
      ...orderDetails,
      payment_type,
    });

    //calculate paid amount to set return amount
    handleCalculatePaid(orderDetails.payment_amount, payment_type);
  };

  //payment type
  const handleTotalGuest = (e) => {
    setOrderDetails({
      ...orderDetails,
      total_guest: e.target.value,
    });
  };

  //payment type amount
  const handlePaymentTypeAmount = (e) => {
    let tempPaymentAmount = {
      ...orderDetails.payment_amount,
      [e.target.name]: e.target.value,
    };

    setOrderDetails({
      ...orderDetails,
      payment_amount: tempPaymentAmount,
    });

    //calculate paid amount to set return amount
    handleCalculatePaid(tempPaymentAmount, orderDetails.payment_type);
  };

  //calculate paid amount
  const handleCalculatePaid = (paymentAmount, paymentType) => {
    let paidAmount = 0;
    if (paymentAmount !== null && paymentType !== null) {
      let thePaymentArray = [];
      if (paymentAmount) {
        thePaymentArray = Object.entries(paymentAmount);
      }
      thePaymentArray.map((eachPaymentItem) => {
        let thePaymentType = paymentType.find((paymentTypeItem) => {
          return paymentTypeItem.id === parseInt(eachPaymentItem[0]);
        });
        if (eachPaymentItem[1] !== "") {
          if (
            thePaymentType &&
            thePaymentType.id === parseInt(eachPaymentItem[0])
          ) {
            paidAmount = paidAmount + parseFloat(eachPaymentItem[1]);
          }
        }
      });
      let localCurrency = JSON.parse(localStorage.getItem("currency"));
      paidAmount = paidAmount / localCurrency.rate;
      let theReturnMoney = paidAmount - totalPayable;
      setReturnMoneyUsd(theReturnMoney);
    } else {
      setReturnMoneyUsd(0);
    }
    setPaidMoney(paidAmount);
  };

  //send server req
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (newOrder && newOrder.length > 0) {
      if (paidMoney !== 0) {
        toast.error(
          `${_t(
            t("Settle order to add payments, or remove payment's amount")
          )}`,
          {
            position: "bottom-center",
            closeButton: false,
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            className: "text-center toast-notification",
          }
        );
      } else {
        axiosRequest();
      }
    } else {
      toast.error(`${_t(t("Please add items in order list"))}`, {
        position: "bottom-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        className: "text-center toast-notification",
      });
    }
  };

  //axios request for submit
  const axiosRequest = () => {
    let url = BASE_URL + "/settings/new-order";
    let localCurrency = JSON.parse(localStorage.getItem("currency"));
    let formData = {
      branch: orderDetails.branch,
      customer: orderDetails.customer,
      table: orderDetails.table,
      waiter: orderDetails.waiter,
      dept_tag: orderDetails.dept_tag,
      payment_type: orderDetails.payment_type,
      payment_amount: orderDetails.payment_amount,
      newCustomer: orderDetails.newCustomer ? 1 : 0,
      newCustomerInfo: orderDetails.newCustomerInfo,
      token: orderDetails.token,
      total_guest: orderDetails.total_guest,
      orderItems: newOrder,
      serviceCharge: orderDetails.serviceCharge,
      discount: orderDetails.discount,
      subTotal: theSubTotal,
      totalPayable: totalPayable,
      paidMoney: paidMoney,
      theVat: theVat,
      localCurrency: localCurrency,
      workPeriod: newSettings.workPeriod,
    };
    setLoading(true);
    axios
      .post(url, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        if (res.data !== "ended") {
          handlePrint();
          setCustomerForSearch(res.data[1]);
          setOrderDetailusers({
            ...orderDetailUsers,
            theCustomers: res.data[1],
          });
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(`${_t(t("Please restart the work period"))}`, {
            position: "bottom-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            className: "text-center toast-notification",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error(`${_t(t("Please try again"))}`, {
          position: "bottom-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      });
  };

  //handle settle order
  const handleSettleOrder = (e) => {
    e.preventDefault();
    if (newOrder && newOrder.length > 0) {
      if (paidMoney < totalPayable) {
        toast.error(
          `${_t(
            t("Please enter paid amount atleast equal to the total bill amount")
          )}`,
          {
            position: "bottom-center",
            closeButton: false,
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            className: "text-center toast-notification",
          }
        );
      } else {
        axiosRequestForSettle();
      }
    } else {
      toast.error(`${_t(t("Please add items in order list"))}`, {
        position: "bottom-center",
        closeButton: false,
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        className: "text-center toast-notification",
      });
    }
  };

  //axios request for settlement
  const axiosRequestForSettle = () => {
    let url = BASE_URL + "/settings/settle-order";
    let localCurrency = JSON.parse(localStorage.getItem("currency"));
    let formData = {
      branch: orderDetails.branch,
      customer: orderDetails.customer,
      table: orderDetails.table,
      waiter: orderDetails.waiter,
      dept_tag: orderDetails.dept_tag,
      payment_type: orderDetails.payment_type,
      payment_amount: orderDetails.payment_amount,
      newCustomer: orderDetails.newCustomer ? 1 : 0,
      newCustomerInfo: orderDetails.newCustomerInfo,
      token: orderDetails.token,
      total_guest: orderDetails.total_guest,
      orderItems: newOrder,
      serviceCharge: orderDetails.serviceCharge,
      discount: orderDetails.discount,
      subTotal: theSubTotal,
      totalPayable: totalPayable,
      paidMoney: paidMoney,
      theVat: theVat,
      localCurrency: localCurrency,
      workPeriod: newSettings.workPeriod,
    };
    setLoading(true);
    axios
      .post(url, formData, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        if (res.data !== "ended") {
          if (res.data !== "paymentIssue") {
            handlePrint();
            setCustomerForSearch(res.data[1]);
            setOrderDetailusers({
              ...orderDetailUsers,
              theCustomers: res.data[1],
            });
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(
              `${_t(
                t(
                  "Please enter paid amount atleast equal to the total bill amount"
                )
              )}`,
              {
                position: "bottom-center",
                closeButton: false,
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                className: "text-center toast-notification",
              }
            );
          }
        } else {
          setLoading(false);
          toast.error(`${_t(t("Please restart the work period"))}`, {
            position: "bottom-center",
            closeButton: false,
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            className: "text-center toast-notification",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error(`${_t(t("Please try again"))}`, {
          position: "bottom-center",
          closeButton: false,
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: "text-center toast-notification",
        });
      });
  };

  //print bills
  const componentRef = useRef();
  const component2Ref = useRef();

  // only print bill
  //for pos manager
  const handleOnlyPrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      if (getSystemSettings(generalSettings, "print_kitchen_bill") === "1") {
        handleOnlyPrint2();
      }
    },
  });

  //for kithcen
  const handleOnlyPrint2 = useReactToPrint({
    content: () => component2Ref.current,
  });

  //after order submit or settle
  //for pos manager
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      if (getSystemSettings(generalSettings, "print_kitchen_bill") === "1") {
        handlePrint2();
      } else {
        handleOrderSubmitSuccessful();
      }
    },
  });

  //for kithcen
  const handlePrint2 = useReactToPrint({
    content: () => component2Ref.current,
    onAfterPrint: () => {
      handleOrderSubmitSuccessful();
    },
  });

  //call after successful order submit and settle
  const handleOrderSubmitSuccessful = () => {
    setNewOrder(null);
    setActiveItemInOrder(null);
    setSelectedVariation([]);
    setSelectedPropertyGroup([]);
    setSelectedProperties([]);
    setTheSubTotal(0);
    setTheVat(0);
    setTotalPaybale(0);
    setReturnMoneyUsd(0);
    setPaidMoney(0);
    setOrderDetails({
      branch: orderDetails.branch,
      customer: null,
      table: null,
      waiter: null,
      dept_tag: null,
      payment_type: null,
      payment_amount: null,
      total_guest: 1,
      newCustomer: false,
      newCustomerInfo: {
        name: "",
        number: "",
      },
      token: null,
      serviceCharge: 0,
      discount: 0,
    });
    toast.success(`${_t(t("Order has been taken"))}`, {
      position: "bottom-center",
      closeButton: false,
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      className: "text-center toast-notification",
    });
    //sound
    if (getSystemSettings(generalSettings, "play_sound") === "1") {
      let beep = document.getElementById("myAudio");
      beep.play();
    }
  };

  return (
    <>
      <Helmet>
        <title>{_t(t("POS"))}</title>
      </Helmet>

      {/* beep sound */}
      <audio id="myAudio">
        <source src="/assets/beep/beep.mp3" type="audio/mpeg" />
      </audio>

      {/* Print bill */}
      <div className="d-none">
        <div ref={componentRef}>
          {newOrder && (
            <div className="fk-print t-pt-30 t-pb-30">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <span className="d-block fk-print-text fk-print-text--bold text-uppercase fk-print__title text-center mb-2">
                      {getSystemSettings(generalSettings, "siteName")}
                    </span>
                    <p className="mb-0 xsm-text fk-print-text text-center text-capitalize">
                      {getSystemSettings(generalSettings, "address")}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-center text-capitalize">
                      call: {getSystemSettings(generalSettings, "phnNo")}
                    </p>
                    <hr className="mb-0" />
                    <span className="d-block fk-print-text fk-print-text--bold text-uppercase text-center lg-text">
                      Token: {orderDetails && orderDetails.token.id}
                    </span>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      Vat reg: Applied
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      date: <Moment format="LL">{new Date()}</Moment>
                      {", "}
                      {orderDetails && (
                        <Moment format="LT">{orderDetails.token.time}</Moment>
                      )}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      Total guests: {orderDetails && orderDetails.total_guest}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      waiter name:{" "}
                      {orderDetails && orderDetails.waiter !== null
                        ? orderDetails.waiter.name
                        : ""}
                    </p>
                    <table className="table mb-0 table-borderless">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="fk-print-text fk-print-text--bold sm-text text-capitalize"
                          >
                            item
                          </th>
                          <th
                            scope="col"
                            className="fk-print-text fk-print-text--bold sm-text text-capitalize text-center"
                          >
                            qty
                          </th>
                          <th
                            scope="col"
                            className="fk-print-text fk-print-text--bold sm-text text-capitalize text-right"
                          >
                            price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {newOrder.map((printItem, printItemIndex) => {
                          return (
                            <tr>
                              <th className="fk-print-text xsm-text text-capitalize">
                                <span className="d-block">
                                  {printItem.item.name}
                                </span>
                                {parseInt(printItem.item.has_variation) === 1 &&
                                  printItem.variation && (
                                    <span className="xxsm-text d-block">
                                      Variation:{" "}
                                      {printItem.variation.variation_name}
                                    </span>
                                  )}

                                {/* properties */}
                                {printItem.properties &&
                                  printItem.properties.length > 0 &&
                                  selectedPropertyGroup[printItemIndex] !==
                                    undefined &&
                                  selectedPropertyGroup[printItemIndex].map(
                                    (thisIsGroup) => {
                                      let theGroup =
                                        propertyGroupForSearch &&
                                        propertyGroupForSearch.find(
                                          (theItem) => {
                                            return theItem.id === thisIsGroup;
                                          }
                                        );
                                      return (
                                        <div className="d-block">
                                          <span className="text-capitalize xxsm-text d-inline-block mr-1">
                                            {theGroup && theGroup.name} :
                                          </span>
                                          {printItem.properties.map(
                                            (propertyName, propertyIndex) => {
                                              if (
                                                propertyName.item
                                                  .property_group_id ===
                                                theGroup.id
                                              ) {
                                                return (
                                                  <span className="text-capitalize xxsm-text d-inline-block mr-1">
                                                    {propertyName.item.name}{" "}
                                                    <span>
                                                      {" "}
                                                      {propertyName.quantity >
                                                        1 &&
                                                        "(" +
                                                          propertyName.quantity +
                                                          ")"}
                                                    </span>
                                                    {printItem.properties
                                                      .length -
                                                      1 !==
                                                      propertyIndex && ","}
                                                  </span>
                                                );
                                              } else {
                                                return true;
                                              }
                                            }
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                              </th>
                              <td className="fk-print-text xsm-text text-capitalize text-center">
                                {printItem.quantity}
                              </td>
                              <td className="fk-print-text xsm-text text-capitalize text-right">
                                {currencySymbolLeft()}
                                {showPriceOfEachOrderItem(printItemIndex)}
                                {currencySymbolRight()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <hr />
                    <hr className="m-0" />
                    <table className="table mb-0 table-borderless">
                      <tbody>
                        <tr>
                          <th className="fk-print-text xsm-text text-capitalize">
                            <span className="d-block">total</span>
                          </th>
                          <td className="fk-print-text xsm-text text-capitalize text-right">
                            {currencySymbolLeft()}
                            {formatPrice(theSubTotal)}
                            {currencySymbolRight()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table mb-0 table-borderless">
                      <tbody>
                        <tr>
                          <th className="fk-print-text xsm-text text-capitalize">
                            <span className="d-block">
                              VAT{" ("}
                              {newSettings && newSettings.vat}%{")"}
                            </span>
                          </th>
                          <td className="fk-print-text xsm-text text-capitalize text-right">
                            {currencySymbolLeft()}
                            {formatPrice(theVat)}
                            {currencySymbolRight()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table mb-0 table-borderless">
                      <tbody>
                        <tr>
                          <th className="fk-print-text xsm-text text-capitalize">
                            <span className="d-block">Service Charge</span>
                          </th>

                          {orderDetails && (
                            <td className="fk-print-text xsm-text text-capitalize text-right">
                              {currencySymbolLeft()}
                              {formatPrice(orderDetails.serviceCharge)}
                              {currencySymbolRight()}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                    <table className="table mb-0 table-borderless">
                      <tbody>
                        <tr>
                          <th className="fk-print-text xsm-text text-capitalize">
                            <span className="d-block">discount</span>
                          </th>
                          {orderDetails && (
                            <td className="fk-print-text xsm-text text-capitalize text-right">
                              {currencySymbolLeft()}
                              {formatPrice(orderDetails.discount)}
                              {currencySymbolRight()}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                    <hr />
                    <table className="table mb-0 table-borderless">
                      <tbody>
                        <tr>
                          <th className="fk-print-text fk-print-text--bold sm-text text-capitalize">
                            <span className="d-block">grand total</span>
                          </th>
                          <td className="fk-print-text fk-print-text--bold xsm-text text-capitalize text-right">
                            {currencySymbolLeft()}
                            {formatPrice(totalPayable)}
                            {currencySymbolRight()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                    <hr />
                    <p className="mb-0 xsm-text fk-print-text text-capitalize text-center">
                      bill prepared by:{" "}
                      {authUserInfo &&
                        authUserInfo.details &&
                        authUserInfo.details.name}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize text-center">
                      looking forward to serve you again
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print bill kitchen */}
      <div className="d-none">
        <div ref={component2Ref}>
          {newOrder && (
            <div className="fk-print t-pt-30 t-pb-30">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <span className="d-block fk-print-text fk-print-text--bold text-uppercase fk-print__title text-center mb-2">
                      {getSystemSettings(generalSettings, "siteName")}
                    </span>
                    <p className="mb-0 xsm-text fk-print-text text-center text-capitalize">
                      {getSystemSettings(generalSettings, "address")}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-center text-capitalize">
                      call: {getSystemSettings(generalSettings, "phnNo")}
                    </p>
                    <hr className="mb-0" />
                    <span className="d-block fk-print-text fk-print-text--bold text-uppercase text-center lg-text">
                      Token: {orderDetails && orderDetails.token.id}
                    </span>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      date: <Moment format="LL">{new Date()}</Moment>
                      {", "}
                      {orderDetails && (
                        <Moment format="LT">{orderDetails.token.time}</Moment>
                      )}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      Total guests: {orderDetails && orderDetails.total_guest}
                    </p>
                    <p className="mb-0 xsm-text fk-print-text text-capitalize">
                      waiter name:{" "}
                      {orderDetails && orderDetails.waiter !== null
                        ? orderDetails.waiter.name
                        : ""}
                    </p>
                    <table className="table mb-0 table-borderless">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="fk-print-text fk-print-text--bold sm-text text-capitalize"
                          >
                            item
                          </th>
                          <th
                            scope="col"
                            className="fk-print-text fk-print-text--bold sm-text text-capitalize text-center"
                          >
                            qty
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {newOrder.map((printItem, printItemIndex) => {
                          return (
                            <tr>
                              <th className="fk-print-text xsm-text text-capitalize">
                                <span className="d-block">
                                  {printItem.item.name}
                                </span>
                                {parseInt(printItem.item.has_variation) === 1 &&
                                  printItem.variation && (
                                    <span className="xxsm-text d-block">
                                      Variation:{" "}
                                      {printItem.variation.variation_name}
                                    </span>
                                  )}

                                {/* properties */}
                                {printItem.properties &&
                                  printItem.properties.length > 0 &&
                                  selectedPropertyGroup[printItemIndex] !==
                                    undefined &&
                                  selectedPropertyGroup[printItemIndex].map(
                                    (thisIsGroup) => {
                                      let theGroup =
                                        propertyGroupForSearch &&
                                        propertyGroupForSearch.find(
                                          (theItem) => {
                                            return theItem.id === thisIsGroup;
                                          }
                                        );
                                      return (
                                        <div className="d-block">
                                          <span className="text-capitalize xxsm-text d-inline-block mr-1">
                                            {theGroup && theGroup.name} :
                                          </span>
                                          {printItem.properties.map(
                                            (propertyName, propertyIndex) => {
                                              if (
                                                propertyName.item
                                                  .property_group_id ===
                                                theGroup.id
                                              ) {
                                                return (
                                                  <span className="text-capitalize xxsm-text d-inline-block mr-1">
                                                    {propertyName.item.name}{" "}
                                                    <span>
                                                      {" "}
                                                      {propertyName.quantity >
                                                        1 &&
                                                        "(" +
                                                          propertyName.quantity +
                                                          ")"}
                                                    </span>
                                                    {printItem.properties
                                                      .length -
                                                      1 !==
                                                      propertyIndex && ","}
                                                  </span>
                                                );
                                              } else {
                                                return true;
                                              }
                                            }
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                              </th>
                              <td className="fk-print-text xsm-text text-capitalize text-center">
                                {printItem.quantity}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <hr />
                    <hr />
                    <p className="mb-0 xsm-text fk-print-text text-capitalize text-center">
                      bill prepared by:{" "}
                      {authUserInfo &&
                        authUserInfo.details &&
                        authUserInfo.details.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Addons  */}
      <div className="modal fade" id="menuAddons" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header align-items-start">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  {foodItem.selectedItem !== null && foodItem.selectedItem.name}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Variations */}
              <div className="fk-sm-card__container">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    {_t(t("Variations"))}
                  </h6>
                </div>
                {foodItem.variations && (
                  <span className="text-capitalize xxsm-text fk-badge fk-badge--secondary">
                    {_t(t("Required"))}
                  </span>
                )}
              </div>
              <hr />
              <ul className="t-list addons-list">
                {foodItem.variations ? (
                  <>
                    {foodItem.variations.map((variationItem) => {
                      return (
                        <li className="addons-list__item">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="col">
                              <label className="mx-checkbox flex-grow-1">
                                <input
                                  type="checkbox"
                                  className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm mt-0-kitchen"
                                  name="variation"
                                  onChange={() => {
                                    handleOrderItemVariation(variationItem);
                                  }}
                                  checked={checkChecked(variationItem)}
                                />
                                <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                                  {variationItem.variation_name}
                                </span>
                              </label>
                            </div>
                            <div className="col text-right">
                              <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                {currencySymbolLeft()}
                                {formatPrice(
                                  variationItem.food_with_variation_price
                                )}
                                {currencySymbolRight()}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  <li className="addons-list__item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="col text-center text-primary text-uppercase">
                        {_t(t("No Variations"))}
                      </div>
                    </div>
                  </li>
                )}
                {/* Variations end*/}
              </ul>

              <div className={foodItem.properties ? "" : "d-none"}>
                {/* Property group and items */}
                {foodItem.properties && (
                  <>
                    {foodItem.properties.map((propertyItem) => {
                      //property group
                      let selectedGroup =
                        propertyGroupForSearch &&
                        propertyGroupForSearch.find((singlePropertyGroup) => {
                          return (
                            singlePropertyGroup.id ===
                            propertyItem[0].property_group_id
                          );
                        });
                      return (
                        <>
                          <div className="fk-sm-card__container t-mt-30">
                            <div className="fk-sm-card__content">
                              <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                                {selectedGroup && selectedGroup.name}
                              </h6>
                            </div>
                            <span className="text-capitalize xxsm-text fk-badge fk-badge--secondary">
                              {_t(t("Optional"))}
                            </span>
                          </div>
                          <hr />
                          <ul className="t-list addons-list">
                            {propertyItem.map((eachItem) => {
                              return (
                                <li className="addons-list__item">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="col">
                                      <label className="mx-checkbox flex-grow-1">
                                        <input
                                          type="checkbox"
                                          className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm mt-0-kitchen"
                                          onChange={() => {
                                            newOrder &&
                                              newOrder.map(
                                                (newOrderItem, index) => {
                                                  if (
                                                    index === activeItemInOrder
                                                  ) {
                                                    if (
                                                      newOrderItem.properties
                                                    ) {
                                                      let theItem = newOrderItem.properties.find(
                                                        (eachPropertyItem) => {
                                                          return (
                                                            eachPropertyItem
                                                              .item.id ===
                                                            eachItem.id
                                                          );
                                                        }
                                                      );

                                                      if (
                                                        theItem === undefined
                                                      ) {
                                                        handleAddProperties(
                                                          eachItem
                                                        );
                                                      } else {
                                                        handleRemoveProperties(
                                                          eachItem
                                                        );
                                                      }
                                                    } else {
                                                      handleAddProperties(
                                                        eachItem
                                                      );
                                                    }
                                                  }
                                                }
                                              );
                                          }}
                                          checked={checkCheckedProperties(
                                            eachItem
                                          )}
                                        />
                                        <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                                          {eachItem.name}
                                        </span>
                                      </label>
                                    </div>
                                    <div className="col">
                                      <div className="fk-qty flex-grow-1 justify-content-end">
                                        {eachItem.allow_multi_quantity ===
                                          1 && (
                                          <span
                                            className="fk-qty__icon fk-qty__deduct"
                                            onClick={() => {
                                              handlePropertyQty(eachItem, "-");
                                            }}
                                          >
                                            <i className="las la-minus"></i>
                                          </span>
                                        )}
                                        {eachItem.allow_multi_quantity === 1 ? (
                                          <input
                                            type="text"
                                            value={checkCheckedPropertyQuantity(
                                              eachItem
                                            )}
                                            className="fk-qty__input t-bg-clear"
                                            readOnly
                                          />
                                        ) : (
                                          "-"
                                        )}
                                        {eachItem.allow_multi_quantity ===
                                          1 && (
                                          <span
                                            className="fk-qty__icon fk-qty__add"
                                            onClick={() => {
                                              handlePropertyQty(eachItem, "+");
                                            }}
                                          >
                                            <i className="las la-plus"></i>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col text-right">
                                      <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                        {currencySymbolLeft()}
                                        {formatPrice(eachItem.extra_price)}
                                        {currencySymbolRight()}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                          <hr />
                        </>
                      );
                    })}
                  </>
                )}
              </div>
              {/* Property group and items */}
            </div>
          </div>
        </div>
      </div>
      {/* Menu Addons End */}

      {/* Show Cart  */}
      <div className="modal fade" id="showCart" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <h3>Order details</h3>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <span className="sm-text font-weight-bold text-uppercase font-italic">
                    Order token:{" "}
                    {newOrder ? (
                      <>
                        #{orderDetails.token.id} -{" "}
                        <Moment format="LT">{orderDetails.token.time}</Moment>
                      </>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </div>
              <div className="fk-sm-card__container t-mt-30">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    order items
                  </h6>
                </div>
              </div>
              <hr />
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <span
                        className="t-text-heading sm-text text-capitalize"
                        data-toggle="modal"
                        data-target="#menuAddons"
                      >
                        chicken burger
                      </span>
                    </div>
                    <div className="col">
                      <div className="fk-qty flex-grow-1 justify-content-end">
                        <span className="fk-qty__icon fk-qty__deduct">
                          <i className="las la-minus"></i>
                        </span>
                        <input
                          type="text"
                          value="0"
                          className="fk-qty__input"
                        />
                        <span className="fk-qty__icon fk-qty__add">
                          <i className="las la-plus"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col text-right">
                      <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                        +tk 100
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <hr />
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        sub total{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        {newOrder ? (
                          <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                            {currencySymbolLeft()}
                            {formatPrice(theSubTotal)}
                            {currencySymbolRight()}
                          </span>
                        ) : (
                          <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                            {currencySymbolLeft()}
                            {formatPrice(0)}
                            {currencySymbolRight()}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        VAT ({newSettings && newSettings.vat}%)
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        {currencySymbolLeft()}
                        {formatPrice(theVat)}
                        {currencySymbolRight()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> service </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        20.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        discount{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        100.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        total bill
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col text-right">
                      <span className="text-capitalize sm-text font-weight-bold">
                        2000.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div className="row py-2 mx-1">
              <button
                type="button"
                className="btn btn-secondary xsm-text text-uppercase col-3"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary xsm-text text-uppercase ml-auto mr-1 col-4"
              >
                settle
              </button>
              <button
                type="button"
                className="btn btn-success xsm-text text-uppercase col-4"
              >
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Show Cart End */}

      {/* Extra Info  */}
      <div className="modal fade" id="extraInfo" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header align-items-center">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  additional information
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="t-list addons-list">
                {authUserInfo.details &&
                  authUserInfo.details.user_type !== "staff" && (
                    <li className="addons-list__item mt-1 mx-1">
                      <Select
                        options={branchForSearch && branchForSearch}
                        components={makeAnimated()}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.name}
                        classNamePrefix="select"
                        className="xsm-text"
                        onChange={handleSetBranch}
                        maxMenuHeight="200px"
                        placeholder={_t(t("Branch")) + ".."}
                      />
                    </li>
                  )}
                {!loading && (
                  <>
                    {orderDetails.branch !== null && (
                      <>
                        <li
                          className={`addons-list__item mx-1 ${
                            authUserInfo.details &&
                            authUserInfo.details.user_type === "staff" &&
                            "mt-1"
                          }`}
                        >
                          <Select
                            options={
                              orderDetailUsers.theCustomers !== null &&
                              orderDetailUsers.theCustomers
                            }
                            components={makeAnimated()}
                            getOptionLabel={(option) =>
                              option.name + " (" + option.phn_no + ")"
                            }
                            getOptionValue={(option) => option.name}
                            classNamePrefix="select"
                            className="xsm-text"
                            onChange={handleSetCustomer}
                            maxMenuHeight="200px"
                            placeholder={_t(t("Customer")) + ".."}
                          />
                        </li>
                        <li className="addons-list__item mx-1 border border-2 rounded-lg">
                          <div className="btn-group w-100">
                            <button
                              type="button"
                              className="fk-right-nav__guest-btn btn w-100 t-bg-white dropdown-toggle new-customer-pos xsm-text pl-2"
                              data-toggle="dropdown"
                              aria-expanded="false"
                            >
                              + Customer?
                            </button>
                            <ul className="dropdown-menu w-100 border-0 pt-4 change-background">
                              <li>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control font-10px rounded-lg"
                                  placeholder="Name"
                                  autoComplete="off"
                                  value={orderDetails.newCustomerInfo.name}
                                  onChange={handleNewCustomer}
                                />
                              </li>
                              <li className="pb-2">
                                <input
                                  type="text"
                                  name="number"
                                  className="form-control font-10px mt-2 rounded-lg"
                                  autoComplete="off"
                                  placeholder="Number"
                                  value={orderDetails.newCustomerInfo.number}
                                  onChange={handleNewCustomer}
                                />
                              </li>
                              <li className="pb-1 text-right">
                                <button
                                  className="btn t-bg-white text-dark xsm-text text-uppercase btn-sm py-0 px-2 mr-1"
                                  onClick={() => {
                                    setOrderDetails({
                                      ...orderDetails,
                                      newCustomer: false,
                                      newCustomerInfo: {
                                        name: "",
                                        number: "",
                                      },
                                    });
                                  }}
                                >
                                  Cancel
                                </button>
                              </li>
                            </ul>
                          </div>
                        </li>

                        <li className="addons-list__item mx-1">
                          <Select
                            options={deptTagForSearch && deptTagForSearch}
                            components={makeAnimated()}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.name}
                            classNamePrefix="select"
                            className="xsm-text"
                            onChange={handleSetDeptTag}
                            maxMenuHeight="200px"
                            placeholder={_t(t("Dept tag")) + ".."}
                          />
                        </li>
                        <li
                          className={`addons-list__item mx-1 payment-type-parent ${
                            orderDetails.payment_type !== null && "mb-1"
                          }`}
                        >
                          <Select
                            options={
                              paymentTypeForSearch && paymentTypeForSearch
                            }
                            components={makeAnimated()}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.name}
                            classNamePrefix="select"
                            className="xsm-text"
                            onChange={handleSetpaymentType}
                            maxMenuHeight="200px"
                            isMulti
                            backspaceRemovesValue={false}
                            clearIndicator={null}
                            placeholder={_t(t("Payments")) + ".."}
                          />
                        </li>
                        {orderDetails.payment_type !== null && (
                          <div className="border mt-0 mb-2 change-background mx-1 rounded-lg">
                            <div className="xsm-text text-center text-white pt-1">
                              Amount
                            </div>
                            {orderDetails.payment_type.map(
                              (eachPaymentType, paymentTypeIndex) => {
                                return (
                                  <li className="addons-list__item mx-1 mb-1">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      name={eachPaymentType.id}
                                      autoComplete="off"
                                      className="form-control xsm-text pl-2"
                                      onChange={handlePaymentTypeAmount}
                                      placeholder={eachPaymentType.name}
                                      value={
                                        orderDetails.payment_amount &&
                                        orderDetails.payment_amount[
                                          eachPaymentType.id
                                        ]
                                      }
                                    />
                                  </li>
                                );
                              }
                            )}
                          </div>
                        )}

                        <li className="addons-list__item mx-1">
                          <Select
                            options={
                              orderDetailUsers.theTables !== null &&
                              orderDetailUsers.theTables
                            }
                            components={makeAnimated()}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.name}
                            classNamePrefix="select"
                            className="xsm-text"
                            onChange={handleSetTable}
                            maxMenuHeight="200px"
                            placeholder={_t(t("Table")) + ".."}
                          />
                        </li>
                        <li className="addons-list__item mx-1">
                          <Select
                            options={
                              orderDetailUsers.theWaiters !== null &&
                              orderDetailUsers.theWaiters
                            }
                            components={makeAnimated()}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.name}
                            classNamePrefix="select"
                            className="xsm-text"
                            onChange={handleSetWaiter}
                            maxMenuHeight="200px"
                            placeholder={_t(t("Waiter")) + ".."}
                          />
                        </li>

                        <li className="addons-list__item mx-1">
                          <input
                            type="number"
                            className="form-control xsm-text py-2 pl-2"
                            min="1"
                            onChange={handleTotalGuest}
                            placeholder={_t(t("Total guest")) + ".."}
                          />
                        </li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Extra Info End */}

      <main id="main" data-simplebar>
        {/* Mobile Screen Only   */}
        <div className="d-md-none t-mb-15">
          {/* Show start work period options here */}
          {newSettings && newSettings.workPeriod === null && (
            <div className="fk-left-overlay">
              <div className="fk-left-overlay__content text-center m-auto">
                <h5
                  className={`text-primary text-uppercase ${
                    authUserInfo.details &&
                    authUserInfo.details.user_type !== "staff" &&
                    "mb-0"
                  }`}
                >
                  {authUserInfo.details &&
                  authUserInfo.details.user_type !== "staff"
                    ? _t(t("Select branch to active POS"))
                    : _t(t("start workperiod"))}
                </h5>
                {authUserInfo.details &&
                  authUserInfo.details.user_type !== "staff" && (
                    <>
                      <h6 className="mt-1 text-uppercase xsm-text mb-1">
                        {_t(t("Start workperiod if it is not started"))}
                      </h6>
                      <small className="d-flex justify-content-center text-lowercase xsm-text mt-0 mb-2">
                        (
                        {_t(
                          t("Use staff account not to see this multiple times")
                        )}
                        )
                      </small>
                    </>
                  )}
                <NavLink
                  to="/dashboard"
                  className="t-heading-font btn btn-primary btn-sm text-uppercase sm-text"
                >
                  Goto Dashboard
                </NavLink>
              </div>
            </div>
          )}
          {/* Show start work period options here */}
          {foodGroupForSearch &&
            foodGroupForSearch.map((mobileGroup, mobileGroupIndex) => {
              let tempItems =
                foodForSearch &&
                foodForSearch.filter((tempItem) => {
                  return parseInt(tempItem.food_group_id) === mobileGroup.id;
                });
              return (
                <div
                  className="fk-sm-card t-mt-10"
                  id={`card-${mobileGroupIndex + 1}`}
                >
                  <h3 className="mt-0 t-mb-30 text-capitalize">
                    {mobileGroup.name}
                  </h3>
                  <ul className="t-list fk-sm-card-list">
                    {tempItems.length > 0
                      ? [
                          tempItems.map((mobileItem, mobileItemIndex) => {
                            return (
                              <li
                                className="fk-sm-card-list__item"
                                data-toggle="modal"
                                data-target="#menuAddons"
                                key={mobileItemIndex}
                                onClick={() => {
                                  //set active item in order list
                                  setActiveItemInOrder(mobileItemIndex);
                                  // set variations, properties and selected items here
                                  setFoodItem({
                                    ...foodItem,
                                    foodGroup: mobileGroup,
                                    selectedItem: mobileItem,
                                    variations:
                                      mobileItem &&
                                      parseInt(mobileItem.has_variation) === 1
                                        ? mobileItem.variations
                                        : null,
                                    properties:
                                      mobileItem &&
                                      parseInt(mobileItem.has_property) === 1
                                        ? mobileItem.properties
                                        : null,
                                  });
                                  handleOrderItem(mobileItem);
                                }}
                              >
                                <div className="fk-sm-card__container align-items-center">
                                  <div className="fk-sm-card__content">
                                    <h6 className="text-capitalize fk-sm-card__title">
                                      {mobileItem.name}
                                    </h6>
                                    {mobileItem.has_variation === "0" && (
                                      <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                                        {currencySymbolLeft()}
                                        {formatPrice(
                                          parseFloat(mobileItem.price)
                                        )}
                                        {currencySymbolRight()}
                                      </p>
                                    )}
                                  </div>
                                  <div className="fk-sm-card__action">
                                    <div
                                      className="fk-sm-card__img fk-sm-card__img--1"
                                      style={{
                                        backgroundImage: `url(${mobileItem.image})`,
                                      }}
                                    ></div>
                                    <div className="fk-sm-card__cart">
                                      <i className="las la-plus"></i>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          }),
                        ]
                      : ""}
                  </ul>
                </div>
              );
            })}

          <div className="fk-sm-footnav" style={{ zIndex: 10 }}>
            <div className="fk-sm-footnav__container">
              <ul className="t-list fk-sm-footnav__list justify-content-center">
                <li
                  className="fk-sm-footnav__list-item"
                  data-toggle="modal"
                  data-target="#extraInfo"
                >
                  <span className="t-link fk-sm-footnav__link">
                    <i className="las la-edit"></i>
                  </span>
                </li>
                <li
                  className="fk-sm-footnav__list-item"
                  data-toggle="modal"
                  data-target="#showCart"
                >
                  <span className="t-link fk-sm-footnav__link">
                    <i className="las la-shopping-cart"></i>
                  </span>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <NavLink
                    to="/dashboard/pos/submitted"
                    className="t-link fk-sm-footnav__link"
                  >
                    <i className="las la-share-square"></i>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Mobile Screen Only   */}

        {/* Show In Tab   */}
        <div className="fk-main d-none d-md-block t-mt-10">
          <div className="container-fluid">
            <div className="row gx-2">
              {/* Left Side  */}
              <div className="col-md-7">
                <div className="fk-left-over">
                  {/* Show start work period options here */}
                  {newSettings && newSettings.workPeriod === null && (
                    <div className="fk-left-overlay">
                      <div className="fk-left-overlay__content text-center m-auto">
                        <h5
                          className={`text-primary text-uppercase ${
                            authUserInfo.details &&
                            authUserInfo.details.user_type !== "staff" &&
                            "mb-0"
                          }`}
                        >
                          {authUserInfo.details &&
                          authUserInfo.details.user_type !== "staff"
                            ? _t(t("Select branch to active POS"))
                            : _t(t("start workperiod"))}
                        </h5>
                        {authUserInfo.details &&
                          authUserInfo.details.user_type !== "staff" && (
                            <>
                              <h6 className="mt-1 text-uppercase xsm-text mb-1">
                                {_t(t("Start workperiod if it is not started"))}
                              </h6>
                              <small className="d-flex justify-content-center text-lowercase xsm-text mt-0 mb-2">
                                (
                                {_t(
                                  t(
                                    "Use staff account not to see this multiple times"
                                  )
                                )}
                                )
                              </small>
                            </>
                          )}
                        <NavLink
                          to="/dashboard"
                          className="t-heading-font btn btn-primary btn-sm text-uppercase sm-text"
                        >
                          Goto Dashboard
                        </NavLink>
                      </div>
                    </div>
                  )}
                  {/* Show start work period options here */}

                  <div className="row gx-2 align-items-center">
                    <div className="col-md-4 col-lg-5 col-xl-6 col-xxl-7">
                      <div className="input-group">
                        <button className="btn btn-primary" type="button">
                          <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                        <div className="form-file">
                          <input
                            type="text"
                            className="form-control border-0 form-control--light-2 rounded-0"
                            placeholder={_t(t("Search by name, group")) + ".."}
                            onChange={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8 col-lg-7 col-xl-6 col-xxl-5">
                      <div className="row align-items-center gx-2">
                        <div className="col">
                          {window.location.pathname ===
                          "/dashboard/pos/settled" ? (
                            <NavLink
                              to="/refresh"
                              className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-success xsm-text text-uppercase text-center w-100"
                            >
                              Settled
                            </NavLink>
                          ) : (
                            <NavLink
                              to="/dashboard/pos/settled"
                              className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-success xsm-text text-uppercase text-center w-100"
                            >
                              Settled
                            </NavLink>
                          )}
                        </div>
                        <div className="col">
                          {window.location.pathname ===
                          "/dashboard/pos/submitted" ? (
                            <NavLink
                              to="/refresh"
                              className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-primary xsm-text text-uppercase text-center w-100"
                            >
                              Submitted
                            </NavLink>
                          ) : (
                            <NavLink
                              to="/dashboard/pos/submitted"
                              className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-primary xsm-text text-uppercase text-center w-100"
                            >
                              Submitted
                            </NavLink>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row t-mt-10 gx-2">
                    {/* Left Menu   */}
                    <div className="col-md-4 col-xl-3">
                      <div className="fk-scroll--pos-menu" data-simplebar>
                        <ul className="t-list fk-pos-nav list-group">
                          {/* Food groups */}
                          {foodGroupForSearch &&
                            foodGroupForSearch.map((groupItem, groupIndex) => {
                              return (
                                <li
                                  className="fk-pos-nav__list"
                                  key={groupIndex}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // set active group, group items, initial item active, todo:: set variations and properties
                                      let tempItems =
                                        foodForSearch &&
                                        foodForSearch.filter((tempItem) => {
                                          return (
                                            parseInt(tempItem.food_group_id) ===
                                            groupItem.id
                                          );
                                        });

                                      if (tempItems && tempItems.length > 0) {
                                        setFoodItem({
                                          ...foodItem,
                                          foodGroup: groupItem,
                                          items: tempItems,
                                          selectedItem:
                                            tempItems && tempItems[0],
                                          variations:
                                            tempItems &&
                                            parseInt(
                                              tempItems[0].has_variation
                                            ) === 1
                                              ? tempItems[0].variations
                                              : null,
                                          properties:
                                            tempItems &&
                                            parseInt(
                                              tempItems[0].has_property
                                            ) === 1
                                              ? tempItems[0].properties
                                              : null,
                                        });
                                      } else {
                                        setFoodItem({
                                          foodGroup: groupItem,
                                          items: null,
                                          selectedItem: null,
                                          variations: null,
                                          properties: null,
                                        });
                                      }

                                      //set active item in order list
                                      setActiveItemInOrder(null);
                                    }}
                                    //set active or !
                                    className={`w-100 t-text-dark t-heading-font btn btn-outline-danger font-weight-bold text-uppercase ${
                                      foodItem.foodGroup &&
                                      foodItem.foodGroup.id === groupItem.id &&
                                      "active"
                                    }`}
                                  >
                                    {groupItem.name}
                                  </button>
                                </li>
                              );
                            })}
                          {/* Food groups */}
                        </ul>
                      </div>
                    </div>
                    {/* Left Menu  End */}

                    {/* Dish Addons   */}
                    <div className="col-md-8 col-xl-9">
                      <div className="">
                        <div className="active" id="nav-1">
                          <div className="row gx-1">
                            <div className="col-xl-6 col-xxl-5 order-xl-2">
                              <div className="tab-content t-mb-10 mb-xl-0">
                                <div className="" id="addons-1">
                                  <div className="t-bg-white">
                                    <div
                                      className="fk-addons-variation"
                                      data-simplebar
                                    >
                                      {/* Variations */}
                                      <div className="fk-addons-table">
                                        <div className="fk-addons-table__head text-center">
                                          variations
                                        </div>
                                        {foodItem.variations ? (
                                          <>
                                            <div className="fk-addons-table__info">
                                              <div className="row g-0">
                                                <div className="col-8 pl-3 border-right">
                                                  <span className="fk-addons-table__info-text text-capitalize">
                                                    name
                                                  </span>
                                                </div>
                                                <div className="col-4 text-center">
                                                  <span className="fk-addons-table__info-text text-capitalize">
                                                    price
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="fk-addons-table__body">
                                              {foodItem.variations.map(
                                                (variationItem) => {
                                                  return (
                                                    <div className="fk-addons-table__body-row">
                                                      <div className="row g-0">
                                                        <div className="col-8 border-right t-pl-10 t-pr-10">
                                                          <label className="mx-checkbox">
                                                            <input
                                                              type="radio"
                                                              className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                                              name="variation"
                                                              onChange={() => {
                                                                handleOrderItemVariation(
                                                                  variationItem
                                                                );
                                                              }}
                                                              checked={checkChecked(
                                                                variationItem
                                                              )}
                                                            />
                                                            <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8 fk-addons-table__body-text">
                                                              {
                                                                variationItem.variation_name
                                                              }
                                                            </span>
                                                          </label>
                                                        </div>
                                                        <div className="col-4 text-center">
                                                          <span className="fk-addons-table__body-text sm-text">
                                                            {currencySymbolLeft()}
                                                            {formatPrice(
                                                              variationItem.food_with_variation_price
                                                            )}
                                                            {currencySymbolRight()}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="fk-addons-table__info py-4">
                                            <div className="row g-0">
                                              <div className="col-12 text-center border-right">
                                                <span className="fk-addons-table__info-text text-capitalize text-primary">
                                                  No variations
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {/* Variations end*/}

                                      <div
                                        className={
                                          foodItem.properties ? "" : "d-none"
                                        }
                                      >
                                        {/* Property group and items */}
                                        {foodItem.properties && (
                                          <>
                                            {foodItem.properties.map(
                                              (propertyItem) => {
                                                //property group
                                                let selectedGroup =
                                                  propertyGroupForSearch &&
                                                  propertyGroupForSearch.find(
                                                    (singlePropertyGroup) => {
                                                      return (
                                                        singlePropertyGroup.id ===
                                                        propertyItem[0]
                                                          .property_group_id
                                                      );
                                                    }
                                                  );
                                                return (
                                                  <div className="fk-addons-table">
                                                    <div className="fk-addons-table__head text-center">
                                                      {selectedGroup &&
                                                        selectedGroup.name}
                                                    </div>
                                                    <div className="fk-addons-table__info">
                                                      <div className="row g-0">
                                                        <div className="col-5 pl-3 border-right">
                                                          <span className="fk-addons-table__info-text text-capitalize">
                                                            name
                                                          </span>
                                                        </div>
                                                        <div className="col-3 text-center border-right">
                                                          <span className="fk-addons-table__info-text text-capitalize">
                                                            QTY
                                                          </span>
                                                        </div>
                                                        <div className="col-4 text-center">
                                                          <span className="fk-addons-table__info-text text-capitalize">
                                                            Unit price
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="fk-addons-table__body">
                                                      {propertyItem.map(
                                                        (eachItem) => {
                                                          return (
                                                            <div className="fk-addons-table__body-row">
                                                              <div className="row g-0">
                                                                <div className="col-5 border-right t-pl-10 t-pr-10">
                                                                  <label className="mx-checkbox">
                                                                    <input
                                                                      type="checkbox"
                                                                      className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                                                                      onChange={() => {
                                                                        newOrder &&
                                                                          newOrder.map(
                                                                            (
                                                                              newOrderItem,
                                                                              index
                                                                            ) => {
                                                                              if (
                                                                                index ===
                                                                                activeItemInOrder
                                                                              ) {
                                                                                if (
                                                                                  newOrderItem.properties
                                                                                ) {
                                                                                  let theItem = newOrderItem.properties.find(
                                                                                    (
                                                                                      eachPropertyItem
                                                                                    ) => {
                                                                                      return (
                                                                                        eachPropertyItem
                                                                                          .item
                                                                                          .id ===
                                                                                        eachItem.id
                                                                                      );
                                                                                    }
                                                                                  );

                                                                                  if (
                                                                                    theItem ===
                                                                                    undefined
                                                                                  ) {
                                                                                    handleAddProperties(
                                                                                      eachItem
                                                                                    );
                                                                                  } else {
                                                                                    handleRemoveProperties(
                                                                                      eachItem
                                                                                    );
                                                                                  }
                                                                                } else {
                                                                                  handleAddProperties(
                                                                                    eachItem
                                                                                  );
                                                                                }
                                                                              }
                                                                            }
                                                                          );
                                                                      }}
                                                                      checked={checkCheckedProperties(
                                                                        eachItem
                                                                      )}
                                                                    />
                                                                    <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8 fk-addons-table__body-text">
                                                                      {
                                                                        eachItem.name
                                                                      }
                                                                    </span>
                                                                  </label>
                                                                </div>
                                                                <div className="col-3 text-center border-right">
                                                                  <div className="fk-qty justify-content-center t-pt-10 t-pb-10">
                                                                    {eachItem.allow_multi_quantity ===
                                                                      1 && (
                                                                      <span
                                                                        className="fk-qty__icon fk-qty__deduct"
                                                                        onClick={() => {
                                                                          handlePropertyQty(
                                                                            eachItem,
                                                                            "-"
                                                                          );
                                                                        }}
                                                                      >
                                                                        <i className="las la-minus"></i>
                                                                      </span>
                                                                    )}
                                                                    {eachItem.allow_multi_quantity ===
                                                                    1 ? (
                                                                      <input
                                                                        type="text"
                                                                        value={checkCheckedPropertyQuantity(
                                                                          eachItem
                                                                        )}
                                                                        className="fk-qty__input t-bg-clear"
                                                                        readOnly
                                                                      />
                                                                    ) : (
                                                                      "-"
                                                                    )}
                                                                    {eachItem.allow_multi_quantity ===
                                                                      1 && (
                                                                      <span
                                                                        className="fk-qty__icon fk-qty__add"
                                                                        onClick={() => {
                                                                          handlePropertyQty(
                                                                            eachItem,
                                                                            "+"
                                                                          );
                                                                        }}
                                                                      >
                                                                        <i className="las la-plus"></i>
                                                                      </span>
                                                                    )}
                                                                  </div>
                                                                </div>
                                                                <div className="col-4 text-center">
                                                                  <span className="fk-addons-table__body-text sm-text">
                                                                    {currencySymbolLeft()}
                                                                    {formatPrice(
                                                                      eachItem.extra_price
                                                                    )}
                                                                    {currencySymbolRight()}
                                                                  </span>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </>
                                        )}
                                      </div>
                                      {/* Property group and items */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-7 order-xl-1">
                              <div className="fk-dish--scroll" data-simplebar>
                                <div className="list-group fk-dish row gx-2">
                                  {foodItem.items &&
                                    foodItem.items.map(
                                      (tempFoodItem, tempFoodItemIndex) => {
                                        return (
                                          <div
                                            onClick={() => {
                                              // set variations, properties and selected items here
                                              setFoodItem({
                                                ...foodItem,
                                                selectedItem: tempFoodItem,
                                                variations:
                                                  tempFoodItem &&
                                                  parseInt(
                                                    tempFoodItem.has_variation
                                                  ) === 1
                                                    ? tempFoodItem.variations
                                                    : null,
                                                properties:
                                                  tempFoodItem &&
                                                  parseInt(
                                                    tempFoodItem.has_property
                                                  ) === 1
                                                    ? tempFoodItem.properties
                                                    : null,
                                              });
                                              handleOrderItem(tempFoodItem);
                                            }}
                                            className={`fk-dish__link t-mb-10 col-md-6 col-lg-4 col-xl-6 col-xxl-4 t-link border-0 pointer-cursor ${
                                              foodItem.selectedItem &&
                                              foodItem.selectedItem.id ===
                                                tempFoodItem.id &&
                                              "active"
                                            }`}
                                          >
                                            <div className="fk-dish-card w-100">
                                              <div className="fk-dish-card__img w-100">
                                                <img
                                                  src={tempFoodItem.image}
                                                  alt="foodkhan"
                                                  className="img-fluid m-auto w-100"
                                                />
                                              </div>
                                              <span className="fk-dish-card__title text-center text-uppercase">
                                                {tempFoodItem.name}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Dish Addons  End */}
                  </div>
                </div>
              </div>
              {/* Left Side End */}

              {/* Right Side  */}
              <div className="col-md-5">
                <div className="row gx-2">
                  <div className="col-md-4 col-xl-3">
                    <div className="fk-right-nav">
                      <div className="row flex-column justify-content-between h-100">
                        <div className="col-12 flex-grow-1">
                          <div className="fk-right-nav__scroll" data-simplebar>
                            <ul className="t-list addons-list">
                              {authUserInfo.details &&
                                authUserInfo.details.user_type !== "staff" && (
                                  <li className="addons-list__item mt-1 mx-1">
                                    <Select
                                      options={
                                        branchForSearch && branchForSearch
                                      }
                                      components={makeAnimated()}
                                      getOptionLabel={(option) => option.name}
                                      getOptionValue={(option) => option.name}
                                      classNamePrefix="select"
                                      className="xsm-text"
                                      onChange={handleSetBranch}
                                      maxMenuHeight="200px"
                                      placeholder={_t(t("Branch")) + ".."}
                                    />
                                  </li>
                                )}
                              {!loading && (
                                <>
                                  {orderDetails.branch !== null && (
                                    <>
                                      <li
                                        className={`addons-list__item mx-1 ${
                                          authUserInfo.details &&
                                          authUserInfo.details.user_type ===
                                            "staff" &&
                                          "mt-1"
                                        }`}
                                      >
                                        <Select
                                          options={
                                            orderDetailUsers.theCustomers !==
                                              null &&
                                            orderDetailUsers.theCustomers
                                          }
                                          components={makeAnimated()}
                                          getOptionLabel={(option) =>
                                            option.name +
                                            " (" +
                                            option.phn_no +
                                            ")"
                                          }
                                          getOptionValue={(option) =>
                                            option.name
                                          }
                                          classNamePrefix="select"
                                          className="xsm-text"
                                          onChange={handleSetCustomer}
                                          maxMenuHeight="200px"
                                          placeholder={_t(t("Customer")) + ".."}
                                        />
                                      </li>
                                      <li className="addons-list__item mx-1 border border-2 rounded-lg">
                                        <div className="btn-group w-100">
                                          <button
                                            type="button"
                                            className="fk-right-nav__guest-btn btn w-100 t-bg-white dropdown-toggle new-customer-pos xsm-text pl-2"
                                            data-toggle="dropdown"
                                            aria-expanded="false"
                                          >
                                            + Customer?
                                          </button>
                                          <ul className="dropdown-menu w-100 border-0 pt-4 change-background">
                                            <li>
                                              <input
                                                type="text"
                                                name="name"
                                                className="form-control font-10px rounded-lg"
                                                placeholder="Name"
                                                autoComplete="off"
                                                value={
                                                  orderDetails.newCustomerInfo
                                                    .name
                                                }
                                                onChange={handleNewCustomer}
                                              />
                                            </li>
                                            <li className="pb-2">
                                              <input
                                                type="text"
                                                name="number"
                                                className="form-control font-10px mt-2 rounded-lg"
                                                autoComplete="off"
                                                placeholder="Number"
                                                value={
                                                  orderDetails.newCustomerInfo
                                                    .number
                                                }
                                                onChange={handleNewCustomer}
                                              />
                                            </li>
                                            <li className="pb-1 text-right">
                                              <button
                                                className="btn t-bg-white text-dark xsm-text text-uppercase btn-sm py-0 px-2 mr-1"
                                                onClick={() => {
                                                  setOrderDetails({
                                                    ...orderDetails,
                                                    newCustomer: false,
                                                    newCustomerInfo: {
                                                      name: "",
                                                      number: "",
                                                    },
                                                  });
                                                }}
                                              >
                                                Cancel
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                      </li>

                                      <li className="addons-list__item mx-1">
                                        <Select
                                          options={
                                            deptTagForSearch && deptTagForSearch
                                          }
                                          components={makeAnimated()}
                                          getOptionLabel={(option) =>
                                            option.name
                                          }
                                          getOptionValue={(option) =>
                                            option.name
                                          }
                                          classNamePrefix="select"
                                          className="xsm-text"
                                          onChange={handleSetDeptTag}
                                          maxMenuHeight="200px"
                                          placeholder={_t(t("Dept tag")) + ".."}
                                        />
                                      </li>
                                      <li
                                        className={`addons-list__item mx-1 payment-type-parent ${
                                          orderDetails.payment_type !== null &&
                                          "mb-1"
                                        }`}
                                      >
                                        <Select
                                          options={
                                            paymentTypeForSearch &&
                                            paymentTypeForSearch
                                          }
                                          components={makeAnimated()}
                                          getOptionLabel={(option) =>
                                            option.name
                                          }
                                          getOptionValue={(option) =>
                                            option.name
                                          }
                                          classNamePrefix="select"
                                          className="xsm-text"
                                          onChange={handleSetpaymentType}
                                          maxMenuHeight="200px"
                                          isMulti
                                          backspaceRemovesValue={false}
                                          clearIndicator={null}
                                          placeholder={_t(t("Payments")) + ".."}
                                        />
                                      </li>
                                      {orderDetails.payment_type !== null && (
                                        <div className="border mt-0 mb-2 change-background mx-1 rounded-lg">
                                          <div className="xsm-text text-center text-white pt-1">
                                            Amount
                                          </div>
                                          {orderDetails.payment_type.map(
                                            (
                                              eachPaymentType,
                                              paymentTypeIndex
                                            ) => {
                                              return (
                                                <li className="addons-list__item mx-1 mb-1">
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    name={eachPaymentType.id}
                                                    autoComplete="off"
                                                    className="form-control xsm-text pl-2"
                                                    onChange={
                                                      handlePaymentTypeAmount
                                                    }
                                                    placeholder={
                                                      eachPaymentType.name
                                                    }
                                                    value={
                                                      orderDetails.payment_amount &&
                                                      orderDetails
                                                        .payment_amount[
                                                        eachPaymentType.id
                                                      ]
                                                    }
                                                  />
                                                </li>
                                              );
                                            }
                                          )}
                                        </div>
                                      )}

                                      <li className="addons-list__item mx-1">
                                        <Select
                                          options={
                                            orderDetailUsers.theTables !==
                                              null && orderDetailUsers.theTables
                                          }
                                          components={makeAnimated()}
                                          getOptionLabel={(option) =>
                                            option.name
                                          }
                                          getOptionValue={(option) =>
                                            option.name
                                          }
                                          classNamePrefix="select"
                                          className="xsm-text"
                                          onChange={handleSetTable}
                                          maxMenuHeight="200px"
                                          placeholder={_t(t("Table")) + ".."}
                                        />
                                      </li>
                                      <li className="addons-list__item mx-1">
                                        <Select
                                          options={
                                            orderDetailUsers.theWaiters !==
                                              null &&
                                            orderDetailUsers.theWaiters
                                          }
                                          components={makeAnimated()}
                                          getOptionLabel={(option) =>
                                            option.name
                                          }
                                          getOptionValue={(option) =>
                                            option.name
                                          }
                                          classNamePrefix="select"
                                          className="xsm-text"
                                          onChange={handleSetWaiter}
                                          maxMenuHeight="200px"
                                          placeholder={_t(t("Waiter")) + ".."}
                                        />
                                      </li>

                                      <li
                                        className="addons-list__item mx-1"
                                        style={{ paddingBottom: "100px" }}
                                      >
                                        <input
                                          type="number"
                                          className="form-control xsm-text py-2 pl-2"
                                          min="1"
                                          onChange={handleTotalGuest}
                                          placeholder={
                                            _t(t("Total guest")) + ".."
                                          }
                                        />
                                      </li>
                                    </>
                                  )}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 t-mb-10">
                              <button
                                onClick={() => {
                                  if (newOrder) {
                                    handleOnlyPrint();
                                  } else {
                                    toast.error(
                                      `${_t(
                                        t(
                                          "Please add items in order list to print bill"
                                        )
                                      )}`,
                                      {
                                        position: "bottom-center",
                                        closeButton: false,
                                        autoClose: 10000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        className:
                                          "text-center toast-notification",
                                      }
                                    );
                                  }
                                }}
                                className="w-100 t-heading-font btn btn-outline-danger font-weight-bold text-uppercase sm-text"
                              >
                                print bill
                              </button>
                            </div>
                            <div className="col-12">
                              <button
                                className="w-100 t-heading-font btn btn-primary font-weight-bold text-uppercase sm-text"
                                onClick={handleCancelConfirmation}
                              >
                                cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 col-xl-9">
                    <div className="fk-right-nav p-2 p-xl-3 t-bg-white">
                      {/* Disply Only Small Screen   */}
                      <div className="h-100 w-100 d-none" data-simplebar>
                        <div className="fk-receipt-content">
                          <div className="fk-receipt-body t-mt-10">
                            <div className="row g-0">
                              <div className="col-12">
                                <span className="sm-text font-weight-bold text-uppercase font-italic">
                                  Order token:{" "}
                                  {newOrder ? (
                                    <>
                                      #{orderDetails.token.id} -{" "}
                                      <Moment format="LT">
                                        {orderDetails.token.time}
                                      </Moment>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="fk-sm-card__container t-mt-30">
                              <div className="fk-sm-card__content">
                                <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                                  food items
                                </h6>
                                <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                                  properties & bill
                                </p>
                              </div>
                              <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                                total
                              </span>
                            </div>
                            <hr />
                            <ul className="t-list addons-list">
                              <li className="addons-list__item active">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className=" sm-text text-capitalize">
                                      chicken burger
                                    </span>
                                    <span className=" xsm-text text-capitalize d-block">
                                      large
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className=" text-uppercase sm-text flex-grow-1">
                                      +tk 100
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      beef burger
                                    </span>
                                  </div>
                                  <div className="col">
                                    <div className="fk-qty flex-grow-1 justify-content-end">
                                      <span className="fk-qty__icon fk-qty__deduct">
                                        <i className="las la-minus"></i>
                                      </span>
                                      <input
                                        type="text"
                                        value="0"
                                        className="fk-qty__input"
                                      />
                                      <span className="fk-qty__icon fk-qty__add">
                                        <i className="las la-plus"></i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col text-right">
                                    <span className="t-text-heading text-uppercase sm-text flex-grow-1">
                                      +tk 230
                                    </span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                            <hr />
                            <div className="row">
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      sub total
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      {newOrder ? (
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          {currencySymbolLeft()}
                                          {formatPrice(theSubTotal)}
                                          {currencySymbolRight()}
                                        </span>
                                      ) : (
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          {currencySymbolLeft()}
                                          {formatPrice(0)}
                                          {currencySymbolRight()}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      VAT ({newSettings && newSettings.vat}%)
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      {currencySymbolLeft()}
                                      {formatPrice(theVat)}
                                      {currencySymbolRight()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      service
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      20.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      discount
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      100.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      total bill
                                    </span>
                                  </div>
                                  <div className="col text-center">:</div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      2000.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-6">
                                <button
                                  type="button"
                                  className="btn btn-primary w-100 xsm-text text-uppercase"
                                >
                                  settle
                                </button>
                              </div>
                              <div className="col-6">
                                <button
                                  type="button"
                                  className="btn btn-success w-100 xsm-text text-uppercase"
                                >
                                  submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Disply Only Small Screen End  */}

                      {/* Display Only Large Screen   */}
                      <div className="h-100 w-100 d-none d-md-block">
                        <div className="fk-price-table">
                          <div className="fk-price-table__head">
                            <div className="row gx-0 align-items-center">
                              <div className="col-12 text-right">
                                <span className="d-block sm-text font-weight-bold text-uppercase">
                                  Order token:{" "}
                                  {newOrder ? (
                                    <>
                                      #{orderDetails.token.id} -{" "}
                                      <Moment format="LT">
                                        {orderDetails.token.time}
                                      </Moment>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="fk-price-table__body t-mt-10">
                            <div className="fk-price-table__body-top">
                              <div className="fk-table">
                                <div className="fk-table__head">
                                  <div className="row g-0 border">
                                    <div className="col-1 text-center border-right">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        S/L
                                      </span>
                                    </div>
                                    <div className="col-6 text-center border-right">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        food item
                                      </span>
                                    </div>
                                    <div className="col-2 text-center border-right">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        QTY
                                      </span>
                                    </div>
                                    <div className="col-3 text-center">
                                      <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                        price
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="fk-table__body border-bottom"
                                  data-simplebar
                                >
                                  <div className="sky-is-blue reverse-this">
                                    {/* loop through order list items */}
                                    {newOrder && newOrder.length > 0 ? (
                                      newOrder.map(
                                        (orderListItem, orderListItemIndex) => {
                                          return (
                                            <>
                                              <div
                                                className={`fk-table-container-order ${
                                                  orderListItemIndex ===
                                                    activeItemInOrder &&
                                                  "active"
                                                } `}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  //orderListItem's group wise all items
                                                  let tempItems =
                                                    foodForSearch &&
                                                    foodForSearch.filter(
                                                      (tempItem) => {
                                                        return (
                                                          tempItem.food_group_id ===
                                                          orderListItem.item
                                                            .food_group_id
                                                        );
                                                      }
                                                    );

                                                  //orderListItem's group
                                                  let foodGroup =
                                                    foodGroupForSearch &&
                                                    foodGroupForSearch.find(
                                                      (groupItem) => {
                                                        return (
                                                          groupItem.id ===
                                                          parseInt(
                                                            orderListItem.item
                                                              .food_group_id
                                                          )
                                                        );
                                                      }
                                                    );

                                                  // selected pos item
                                                  let selectedItemTemp =
                                                    tempItems &&
                                                    tempItems.find(
                                                      (tempSelectedItem) => {
                                                        return (
                                                          tempSelectedItem.id ===
                                                          orderListItem.item.id
                                                        );
                                                      }
                                                    );

                                                  // Set variations, properties, selected item
                                                  setFoodItem({
                                                    ...foodItem,
                                                    foodGroup: foodGroup,
                                                    items: tempItems,
                                                    selectedItem: selectedItemTemp,
                                                    variations:
                                                      selectedItemTemp &&
                                                      parseInt(
                                                        selectedItemTemp.has_variation
                                                      ) === 1
                                                        ? selectedItemTemp.variations
                                                        : null,
                                                    properties:
                                                      selectedItemTemp &&
                                                      parseInt(
                                                        selectedItemTemp.has_property
                                                      ) === 1
                                                        ? selectedItemTemp.properties
                                                        : null,
                                                  });

                                                  //set active order list index for background color of selected
                                                  setActiveItemInOrder(
                                                    orderListItemIndex
                                                  );
                                                }}
                                              >
                                                <div
                                                  className={`row g-0 border-top-0 border-bottom `}
                                                >
                                                  <div className="col-1 text-center border-left d-flex justify-content-center align-items-center">
                                                    {newOrder.length -
                                                      orderListItemIndex}
                                                  </div>
                                                  <div
                                                    className={`col-6 border-left border-right py-2`}
                                                  >
                                                    <div className="d-flex justify-content-between">
                                                      <span className="text-capitalize d-block t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold t-mr-8">
                                                        {
                                                          orderListItem.item
                                                            .name
                                                        }
                                                      </span>
                                                    </div>
                                                    <div className="row g-0">
                                                      {/* if item has variations show the selected in order list */}
                                                      {parseInt(
                                                        orderListItem.item
                                                          .has_variation
                                                      ) === 1 && (
                                                        <div className="col-12">
                                                          <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                            variation :
                                                          </span>
                                                          <span className="text-capitalize xsm-text d-inline-block badge rounded-pill bg-warning text-dark font-weight-md">
                                                            {orderListItem.variation
                                                              ? orderListItem
                                                                  .variation
                                                                  .variation_name
                                                              : "-"}
                                                          </span>
                                                        </div>
                                                      )}

                                                      {/* if item has properties show the selected in order list, loop here  */}
                                                      {orderListItem.properties &&
                                                        orderListItem.properties
                                                          .length > 0 &&
                                                        selectedPropertyGroup[
                                                          orderListItemIndex
                                                        ] !== undefined &&
                                                        selectedPropertyGroup[
                                                          orderListItemIndex
                                                        ].map((thisIsGroup) => {
                                                          let theGroup =
                                                            propertyGroupForSearch &&
                                                            propertyGroupForSearch.find(
                                                              (theItem) => {
                                                                return (
                                                                  theItem.id ===
                                                                  thisIsGroup
                                                                );
                                                              }
                                                            );
                                                          return (
                                                            <div className="col-12">
                                                              <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pr-5 t-pl-5">
                                                                {theGroup &&
                                                                  theGroup.name}{" "}
                                                                :
                                                              </span>
                                                              {orderListItem.properties.map(
                                                                (
                                                                  propertyName
                                                                ) => {
                                                                  if (
                                                                    propertyName
                                                                      .item
                                                                      .property_group_id ===
                                                                    theGroup.id
                                                                  ) {
                                                                    return (
                                                                      <span className="text-capitalize xsm-text d-inline-block badge rounded-pill bg-warning text-dark font-weight-md mr-1">
                                                                        {
                                                                          propertyName
                                                                            .item
                                                                            .name
                                                                        }{" "}
                                                                        <span>
                                                                          {" "}
                                                                          {propertyName.quantity >
                                                                            1 &&
                                                                            "(" +
                                                                              propertyName.quantity +
                                                                              ")"}
                                                                        </span>
                                                                      </span>
                                                                    );
                                                                  } else {
                                                                    return true;
                                                                  }
                                                                }
                                                              )}
                                                            </div>
                                                          );
                                                        })}

                                                      {/* if item has properties show the selected in order list  */}
                                                    </div>
                                                  </div>
                                                  {/* Quantity */}
                                                  <div className="col-2 text-center border-right d-flex justify-content-center align-items-center">
                                                    <div className="fk-qty t-pt-5 t-pb-5 justify-content-center">
                                                      <span
                                                        className="fk-qty__icon"
                                                        onClick={() => {
                                                          handleOrderItemQty(
                                                            "-"
                                                          );
                                                        }}
                                                      >
                                                        <i className="las la-minus"></i>
                                                      </span>
                                                      <input
                                                        type="text"
                                                        value={
                                                          orderListItem.quantity
                                                        }
                                                        className="fk-qty__input t-bg-clear"
                                                        readOnly
                                                      />
                                                      <span
                                                        className="fk-qty__icon"
                                                        onClick={() => {
                                                          handleOrderItemQty(
                                                            "+"
                                                          );
                                                        }}
                                                      >
                                                        <i className="las la-plus"></i>
                                                      </span>
                                                    </div>
                                                  </div>
                                                  {/* Quantity */}

                                                  {/* Price */}
                                                  <div className="col-3 text-center border-right d-flex justify-content-center align-items-center">
                                                    <span className="text-capitalize sm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                                      {parseInt(
                                                        orderListItem.item
                                                          .has_variation
                                                      ) === 1 ? (
                                                        <>
                                                          {currencySymbolLeft()}

                                                          {showPriceOfEachOrderItem(
                                                            orderListItemIndex
                                                          )}
                                                          {currencySymbolRight()}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {currencySymbolLeft()}
                                                          {showPriceOfEachOrderItem(
                                                            orderListItemIndex
                                                          )}
                                                          {currencySymbolRight()}
                                                        </>
                                                      )}
                                                    </span>
                                                  </div>
                                                  {/* Price */}
                                                </div>
                                              </div>
                                              <span className="text-capitalize  t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold make-this-relative">
                                                <span
                                                  className="badge rounded-pill bg-secondary text-capitalize"
                                                  onClick={() => {
                                                    handleRemoveItemFromOrderList(
                                                      orderListItemIndex
                                                    );
                                                  }}
                                                >
                                                  <i className="fa fa-times"></i>
                                                </span>
                                              </span>
                                            </>
                                          );
                                        }
                                      )
                                    ) : (
                                      <div className="text-primary text-center font-weight-bold pt-5 xsm-text text-uppercase">
                                        {_t(
                                          t(
                                            "Select food item to add to the list"
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="fk-price-table__body-bottom t-mt-10">
                              <div className="fk-table__head">
                                <div className="row g-0 border">
                                  <div className="col-6 text-center border-right">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          sub total
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        {newOrder ? (
                                          <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                            {currencySymbolLeft()}
                                            {formatPrice(theSubTotal)}
                                            {currencySymbolRight()}
                                          </span>
                                        ) : (
                                          <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                            {currencySymbolLeft()}
                                            {formatPrice(0)}
                                            {currencySymbolRight()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-uppercase xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          VAT ({newSettings && newSettings.vat}
                                          %)
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          {currencySymbolLeft()}
                                          {formatPrice(theVat)}
                                          {currencySymbolRight()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-0 border">
                                  <div className="col-6 text-center border-right">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          service charge
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center"
                                          onChange={(e) => {
                                            if (e.target.value !== "") {
                                              setOrderDetails({
                                                ...orderDetails,
                                                serviceCharge: parseFloat(
                                                  e.target.value
                                                ),
                                              });
                                              let totalPayable = 0;
                                              let localCurrency = JSON.parse(
                                                localStorage.getItem("currency")
                                              );
                                              let usdServiceCharge =
                                                parseFloat(e.target.value) /
                                                localCurrency.rate;
                                              let usdDiscount =
                                                parseFloat(
                                                  orderDetails.discount
                                                ) / localCurrency.rate;

                                              totalPayable =
                                                theSubTotal +
                                                theVat +
                                                usdServiceCharge -
                                                usdDiscount;
                                              setTotalPaybale(totalPayable);
                                            } else {
                                              setOrderDetails({
                                                ...orderDetails,
                                                serviceCharge: 0,
                                              });
                                              let totalPayable = 0;
                                              let localCurrency = JSON.parse(
                                                localStorage.getItem("currency")
                                              );
                                              let usdServiceCharge =
                                                parseFloat(0) /
                                                localCurrency.rate;
                                              let usdDiscount =
                                                parseFloat(
                                                  orderDetails.discount
                                                ) / localCurrency.rate;

                                              totalPayable =
                                                theSubTotal +
                                                theVat +
                                                usdServiceCharge -
                                                usdDiscount;
                                              setTotalPaybale(totalPayable);
                                            }
                                          }}
                                          value={
                                            orderDetails.serviceCharge !== 0 &&
                                            orderDetails.serviceCharge
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 text-center">
                                    <div className="row g-0">
                                      <div className="col-6">
                                        <span className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5">
                                          discount
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center"
                                          onChange={(e) => {
                                            if (e.target.value !== "") {
                                              setOrderDetails({
                                                ...orderDetails,
                                                discount: parseFloat(
                                                  e.target.value
                                                ),
                                              });
                                              let totalPayable = 0;
                                              let localCurrency = JSON.parse(
                                                localStorage.getItem("currency")
                                              );
                                              let usdServiceCharge =
                                                parseFloat(
                                                  orderDetails.serviceCharge
                                                ) / localCurrency.rate;
                                              let usdDiscount =
                                                parseFloat(e.target.value) /
                                                localCurrency.rate;

                                              totalPayable =
                                                theSubTotal +
                                                theVat +
                                                usdServiceCharge -
                                                usdDiscount;

                                              setTotalPaybale(totalPayable);
                                            } else {
                                              setOrderDetails({
                                                ...orderDetails,
                                                discount: 0,
                                              });
                                              let totalPayable = 0;
                                              let localCurrency = JSON.parse(
                                                localStorage.getItem("currency")
                                              );
                                              let usdServiceCharge =
                                                parseFloat(
                                                  orderDetails.serviceCharge
                                                ) / localCurrency.rate;
                                              let usdDiscount =
                                                parseFloat(0) /
                                                localCurrency.rate;

                                              totalPayable =
                                                theSubTotal +
                                                theVat +
                                                usdServiceCharge -
                                                usdDiscount;
                                              setTotalPaybale(totalPayable);
                                            }
                                          }}
                                          value={
                                            orderDetails.discount !== 0 &&
                                            orderDetails.discount
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="t-bg-epsilon t-pl-10 t-pr-10">
                                <div className="row">
                                  <div className="col-6">
                                    <span className="text-capitalize font-weight-bold text-light d-block t-pt-8 t-pb-10">
                                      total bill
                                    </span>
                                  </div>
                                  <div className="col-6 text-right">
                                    {totalPayable ? (
                                      <span className="text-capitalize font-weight-bold text-light d-block t-pt-8 t-pb-10">
                                        {currencySymbolLeft()}
                                        {formatPrice(totalPayable)}
                                        {currencySymbolRight()}
                                      </span>
                                    ) : (
                                      <span className="text-capitalize font-weight-bold text-light d-block t-pt-8 t-pb-10">
                                        {currencySymbolLeft()}
                                        {formatPrice(0)}
                                        {currencySymbolRight()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="t-bg-light-2 t-pr-10">
                                <div className="row gx-2 align-items-center">
                                  <div className="col-6"></div>
                                  <div className="col-6 text-right">
                                    <div className="row gx-2 align-items-center">
                                      <div className="col-6 text-left">
                                        <span className="text-capitalize font-weight-bold d-block">
                                          {currencySymbolLeft()}Return
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        {totalPayable <= paidMoney ? (
                                          <span className="text-capitalize font-weight-bold d-block">
                                            {currencySymbolLeft()}
                                            {formatPrice(returnMoneyUsd)}
                                            {currencySymbolRight()}
                                          </span>
                                        ) : (
                                          <span className="text-capitalize font-weight-bold d-block">
                                            {currencySymbolLeft()}
                                            {formatPrice(0)}
                                            {currencySymbolRight()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row g-0 align-items-center t-mt-10">
                                <div className="col-4">
                                  <div className="t-mr-8">
                                    <div className="fk-calculator-container">
                                      <button
                                        type="button"
                                        className="btn btn-info text-uppercase"
                                        onClick={() =>
                                          setCalculatorMenu(!calculatorMenu)
                                        }
                                      >
                                        <i className="fa fa-calculator"></i>
                                      </button>
                                      <div
                                        className={`calculator ${
                                          calculatorMenu && "active"
                                        }`}
                                      >
                                        <Calculator />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-8">
                                  <div className="d-flex justify-content-end align-items-center">
                                    <div className="t-mr-8">
                                      <button
                                        type="button"
                                        className="btn btn-primary sm-text text-uppercase font-weight-bold"
                                        onClick={!loading && handleSettleOrder}
                                      >
                                        {!loading
                                          ? _t(t("settle"))
                                          : _t(t("Please wait"))}
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        className="btn btn-success sm-text text-uppercase font-weight-bold"
                                        onClick={!loading && handleSubmitOrder}
                                      >
                                        {!loading
                                          ? _t(t("submit"))
                                          : _t(t("Please wait"))}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Display Only Large Screen End  */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Side End */}
            </div>
          </div>
        </div>
        {/* Show In Tab   */}
      </main>
    </>
  );
};

export default Pos;
