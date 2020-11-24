import React, { useContext, useEffect, useState, useRef } from "react";

//functions
import {
  _t,
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
// import Calculator from "awesome-react-calculator";

//importing context consumer here
import { UserContext } from "../../../../contexts/User";
import { SettingsContext } from "../../../../contexts/Settings";
import { RestaurantContext } from "../../../../contexts/Restaurant";
import { FoodContext } from "../../../../contexts/Food";

const Pos = () => {
  const myRef = useRef(null);
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

  //new order
  const [newOrder, setNewOrder] = useState(null);
  const [activeItemInOrder, setActiveItemInOrder] = useState(null);
  //checked variations
  const [selectedVariation, setSelectedVariation] = useState([]);
  //selected groups
  const [selectedPropertyGroup, setSelectedPropertyGroup] = useState([]);
  //checked properties
  const [selectedProperties, setSelectedProperties] = useState([]);

  //the sub total
  const [theSubTotal, setTheSubTotal] = useState(0);
  //vat
  const [theVat, setTheVat] = useState(0);

  //vat settings
  let [newSettings, setNewSettings] = useState(null);

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
    setNewSettings({
      ...newSettings,
      vat: generalSettings && getSystemSettings(generalSettings, "type_vat"),
    });
  }, [foodGroupForSearch, foodForSearch]);

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
    let beep = document.getElementById("myAudio");
    beep.play();
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
    let beep = document.getElementById("myAudio");
    beep.play();
  };

  //handle order item quantity
  const handleorderItemQty = (action) => {
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
    setNewOrder(null);
    setActiveItemInOrder(null);
    setSelectedVariation([]);
    setSelectedVariation([]);
    setSelectedPropertyGroup([]);
    setSelectedProperties([]);
    setTheSubTotal(0);
    setTheVat(0);
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
    if (newSettings) {
      let tempVat = (subTotal * parseFloat(newSettings.vat)) / 100;
      setTheVat(tempVat);
    }
    setTheSubTotal(subTotal);
  };

  // {
  //   item: null,
  //   quantity: null,
  //   variation: null,
  //   properties: { item: null, quantity: null },
  // },

  return (
    <>
      <Helmet>
        <title>{_t(t("POS"))}</title>
      </Helmet>

      <audio id="myAudio">
        <source src="/assets/beep/beep.mp3" type="audio/mpeg" />
      </audio>

      {/* Menu Addons  */}
      <div className="modal fade" id="menuAddons" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header align-items-start">
              <div className="fk-sm-card__content">
                <h5 className="text-capitalize fk-sm-card__title">
                  classic chicken
                </h5>
                <p className="mb-0 sm-text t-text-heading t-mb-10 fk-sm-card__description">
                  Chicken patty, cheese, special sauce, onion, tomato, lettuce
                </p>
                <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                  bdt 180.00
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="fk-sm-card__container">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    add ons
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    select up to 12
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                  optional
                </span>
              </div>
              <hr />
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <label className="mx-checkbox flex-grow-1">
                        <input
                          type="checkbox"
                          className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                        />
                        <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                          patty
                        </span>
                      </label>
                    </div>
                    <div className="col">
                      <div className="fk-qty flex-grow-1 justify-content-end">
                        <span className="fk-qty__icon fk-qty__deduct">
                          <i className="las la-minus"></i>
                        </span>
                        <input
                          type="text"
                          value="0"
                          onChange=""
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
              <div className="fk-sm-card__container t-mt-30">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    spice lavel
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    select up to 12
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--secondary">
                  required
                </span>
              </div>
              <hr />
              <ul className="t-list addons-list">
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <label className="mx-checkbox flex-grow-1">
                        <input
                          type="checkbox"
                          className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                        />
                        <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                          patty
                        </span>
                      </label>
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
              <div className="fk-sm-card__container t-mb-15">
                <div className="fk-sm-card__content">
                  <h6 className="text-capitalize fk-sm-card__title t-mb-5">
                    special instruction
                  </h6>
                  <p className="mb-0 xsm-text t-text-heading fk-sm-card__description text-capitalize">
                    please let us know if you are alergic to anything or avoid
                    anything
                  </p>
                </div>
                <span className="text-capitalize xxsm-text fk-badge fk-badge--dark">
                  optional
                </span>
              </div>

              <textarea
                className="form-control xsm-text"
                cols="30"
                rows="5"
                placeholder="e.g No Mayo"
              ></textarea>
            </div>
            <div className="modal-footer">
              <div className="fk-qty justify-content-end">
                <span className="fk-qty__icon fk-qty__deduct">
                  <i className="las la-minus"></i>
                </span>
                <input type="text" value="0" className="fk-qty__input" />
                <span className="fk-qty__icon fk-qty__add">
                  <i className="las la-plus"></i>
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary xsm-text text-uppercase flex-grow-1"
              >
                add to cart
              </button>
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
              <img
                src="/assets/img/logo-alt.png"
                alt="foodkhan"
                className="img-fluid"
              />
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
                    token: R12548795
                  </span>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> name </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        peter parker
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> waiter </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        jhon doe
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        department{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        dine in
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        guest no.{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        05
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text">
                        {" "}
                        table no.{" "}
                      </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col">
                      <span className="text-capitalize sm-text"> payment </span>
                    </div>
                    <div className="col text-center">:</div>
                    <div className="col">
                      <span className="text-capitalize sm-text font-weight-bold">
                        cash
                      </span>
                    </div>
                  </div>
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
                <li className="addons-list__item">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="col">
                      <span className="t-text-heading sm-text text-capitalize">
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
            <div className="modal-footer">
              <div className="fk-qty justify-content-end">
                <span className="fk-qty__icon fk-qty__deduct">
                  <i className="las la-minus"></i>
                </span>
                <input type="text" value="0" className="fk-qty__input" />
                <span className="fk-qty__icon fk-qty__add">
                  <i className="las la-plus"></i>
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary xsm-text text-uppercase flex-grow-1"
              >
                place order
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
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">
                      Select Customer
                    </option>
                    <option value="1">Shoanur Rahman (0123456789)</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Table">Select Table</option>
                    <option value="1">Table 1</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">
                      Select Waiter
                    </option>
                    <option value="1">Shoanur Rahman</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">
                      Department Tag
                    </option>
                    <option value="1">Dine In</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  <select className="fk-select">
                    <option data-display="Select Customer">Payment Type</option>
                    <option value="1">Master Card</option>
                  </select>
                </li>
                <li className="addons-list__item">
                  {/* Example single danger button  */}
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className="btn sm-text text-uppercase w-100 btn-outline-danger dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      total guest
                    </button>
                    <ul className="dropdown-menu w-100 border-0">
                      <li>
                        <input
                          type="number"
                          className="form-control sm-text"
                          placeholder="Total guest.."
                        />
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Extra Info End */}

      <main id="main" data-simplebar>
        {/* Mobile Screen Only   */}
        <div className="d-md-none">
          <div className="fk-sm-card t-mt-10" id="card-1">
            <h3 className="mt-0 t-mb-30 text-capitalize">chicken burger</h3>
            <ul className="t-list fk-sm-card-list">
              <li
                className="fk-sm-card-list__item"
                data-toggle="modal"
                data-target="#menuAddons"
              >
                <div className="fk-sm-card__container">
                  <div className="fk-sm-card__content">
                    <h6 className="text-capitalize fk-sm-card__title">
                      classic chicken
                    </h6>
                    <p className="mb-0 sm-text t-text-dark--light-40 t-mb-10 fk-sm-card__description">
                      Chicken patty, cheese, special sauce, onion, tomato,
                      lettuce
                    </p>
                    <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                      bdt 180.00
                    </p>
                  </div>
                  <div className="fk-sm-card__action">
                    <div className="fk-sm-card__img fk-sm-card__img--1"></div>
                    <div className="fk-sm-card__cart">
                      <i className="las la-plus"></i>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="fk-sm-card t-mt-10 t-mb-10" id="card-2">
            <h3 className="mt-0 t-mb-30 text-capitalize">beef burger</h3>
            <ul className="t-list fk-sm-card-list">
              <li
                className="fk-sm-card-list__item"
                data-toggle="modal"
                data-target="#menuAddons"
              >
                <div className="fk-sm-card__container">
                  <div className="fk-sm-card__content">
                    <h6 className="text-capitalize fk-sm-card__title">
                      classic beef
                    </h6>
                    <p className="mb-0 sm-text t-text-dark--light-40 t-mb-10 fk-sm-card__description">
                      beef patty, cheese, special sauce, onion, tomato, lettuce
                    </p>
                    <p className="t-mt-10 mb-0 sm-text text-uppercase t-text-dark--light-20">
                      bdt 180.00
                    </p>
                  </div>
                  <div className="fk-sm-card__action">
                    <div className="fk-sm-card__img fk-sm-card__img--11"></div>
                    <div className="fk-sm-card__cart">
                      <i className="las la-plus"></i>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="fk-sm-footnav">
            <div
              className="fk-sm-footnav__cart bg-primary"
              data-toggle="modal"
              data-target="#showCart"
            >
              <ul className="t-list fk-sm-nav__bar justify-content-between">
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link text-light">
                    {" "}
                    1{" "}
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link text-light">
                    view cart
                  </a>
                </li>
                <li className="fk-sm-nav__list">
                  <a href="#" className="t-link fk-sm-nav__link text-light">
                    tk 280
                  </a>
                </li>
              </ul>
            </div>
            <div className="fk-sm-footnav__order bg-primary">
              <ul className="t-list fk-sm-nav__bar justify-content-center">
                <li className="fk-sm-nav__list">
                  <a
                    href="#"
                    className="t-link fk-sm-nav__link text-light"
                    data-toggle="modal"
                    data-target="#extraInfo"
                  >
                    additional information
                  </a>
                </li>
              </ul>
            </div>
            <div className="fk-sm-footnav__container">
              <ul className="t-list fk-sm-footnav__list justify-content-between">
                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-concierge-bell"></i>
                  </a>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-file-invoice-dollar"></i>
                  </a>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <a
                    href="#"
                    className="t-link fk-sm-footnav__link text-danger"
                  >
                    <i className="las la-plus-circle"></i>
                  </a>
                </li>

                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-search"></i>
                  </a>
                </li>
                <li className="fk-sm-footnav__list-item">
                  <a href="#" className="t-link fk-sm-footnav__link">
                    <i className="las la-print"></i>
                  </a>
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
                <div className="row gx-2 align-items-center">
                  <div className="col-md-9 col-lg-7 col-xl-6 col-xxl-5">
                    <div className="row align-items-center gx-2">
                      <div className="col">
                        <a
                          href="order-history.html"
                          className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-primary xsm-text text-uppercase text-center w-100"
                        >
                          all order
                        </a>
                      </div>
                      <div className="col">
                        <a
                          href="order-today.html"
                          className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-secondary xsm-text text-uppercase text-center w-100"
                        >
                          current
                        </a>
                      </div>
                      <div className="col">
                        <a
                          href="order-page.html"
                          className="t-link t-pt-8 t-pb-8 t-pl-12 t-pr-12 btn btn-info xsm-text text-uppercase text-center w-100"
                        >
                          new order
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-5 col-xl-6 col-xxl-7">
                    <div className="input-group">
                      <div className="form-file">
                        <input
                          type="text"
                          className="form-control border-0 form-control--light-2 rounded-0"
                          placeholder="Please Search Food"
                        />
                      </div>
                      <button className="btn btn-primary" type="button">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </button>
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
                              <li className="fk-pos-nav__list" key={groupIndex}>
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
                                        selectedItem: tempItems && tempItems[0],
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
                                        <button
                                          type="button"
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
                                          className={`fk-dish__link t-mb-10 col-md-6 col-lg-4 col-xl-6 col-xxl-4 t-link border-0 ${
                                            foodItem.selectedItem &&
                                            foodItem.selectedItem.id ===
                                              tempFoodItem.id &&
                                            "active"
                                          }`}
                                        >
                                          <div className="fk-dish-card">
                                            <div className="fk-dish-card__img">
                                              <img
                                                src={tempFoodItem.image}
                                                alt="foodkhan"
                                                className="img-fluid m-auto"
                                              />
                                            </div>
                                            <span className="fk-dish-card__title text-center text-uppercase">
                                              {tempFoodItem.name}
                                            </span>
                                          </div>
                                        </button>
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
                              <li className="addons-list__item mt-1 mx-1">
                                <Select
                                  options={
                                    customerForSearch && customerForSearch
                                  }
                                  components={makeAnimated()}
                                  getOptionLabel={(option) =>
                                    option.name + " (" + option.phn_no + ")"
                                  }
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Customer")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                <Select
                                  options={tableForSearch && tableForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Table")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                <Select
                                  options={waiterForSearch && waiterForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Waiter")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                <Select
                                  options={deptTagForSearch && deptTagForSearch}
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  placeholder={_t(t("Dept tag")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1 payment-type-parent">
                                <Select
                                  options={
                                    paymentTypeForSearch && paymentTypeForSearch
                                  }
                                  components={makeAnimated()}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.name}
                                  classNamePrefix="select"
                                  className="xsm-text"
                                  onChange={"handleSetBranchId"}
                                  maxMenuHeight="200px"
                                  isMulti
                                  clearIndicator={null}
                                  placeholder={_t(t("Payment type")) + ".."}
                                />
                              </li>
                              <li className="addons-list__item mx-1">
                                {/* Example single danger button  */}
                                <div className="btn-group w-100 xsm-text">
                                  <button
                                    type="button"
                                    className="fk-right-nav__guest-btn btn text-uppercase w-100 t-bg-white dropdown-toggle xsm-text"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    total guest
                                  </button>
                                  <ul className="dropdown-menu w-100 border-0 xsm-text">
                                    <li>
                                      <input
                                        type="number"
                                        className="form-control xsm-text"
                                        placeholder="Total guest.."
                                      />
                                    </li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 t-mb-10">
                              <a
                                className="w-100 t-heading-font btn btn-outline-danger font-weight-bold text-uppercase sm-text"
                                href="#"
                              >
                                print bill
                              </a>
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
                      <div className="h-100 w-100 d-xl-none" data-simplebar>
                        <div className="fk-receipt-content">
                          <div className="fk-receipt-header align-items-center">
                            <img
                              src="/assets/img/logo-alt.png"
                              alt="foodkhan"
                              className="img-fluid"
                            />
                          </div>
                          <div className="fk-receipt-body t-mt-10">
                            <div className="row g-0">
                              <div className="col-12">
                                <span className="sm-text font-weight-bold text-uppercase font-italic">
                                  token: R12548795
                                </span>
                              </div>
                              <div className="col-12">
                                <div className="row g-0">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      name
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      peter parker
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      waiter
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      jhon doe
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      department
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      dine in
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      guest no.
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      05
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      table no.
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      10
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col">
                                    <span className="text-capitalize sm-text">
                                      payment
                                    </span>
                                  </div>
                                  <div className="col text-right">
                                    <span className="text-capitalize sm-text font-weight-bold">
                                      cash
                                    </span>
                                  </div>
                                </div>
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      pizza
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      pasta
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      patty
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      sandwich
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      bun
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      soup
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
                              <li className="addons-list__item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="col">
                                    <span className="t-text-heading sm-text text-capitalize">
                                      drinks
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
                      <div className="h-100 w-100 d-none d-xl-block">
                        <div className="fk-price-table">
                          <div className="fk-price-table__head">
                            <div className="row gx-0 align-items-center">
                              <div className="col-6">
                                <span className="d-block sm-text font-weight-bold text-uppercase font-italic">
                                  token: R12548795
                                </span>
                              </div>
                              <div className="col-6 text-right">
                                <span className="d-block xsm-text text-uppercase">
                                  10/15/2020
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
                                                      {/* <span
                                                      className="text-capitalize d-block t-pt-5 t-pb-5 t-pl-5 t-pr-5 sm-text font-weight-bold"
                                                      onClick={() => {
                                                        handleRemoveItemFromOrderList(
                                                          orderListItemIndex
                                                        );
                                                      }}
                                                    >
                                                      <span className="badge rounded-pill bg-secondary text-capitalize">
                                                        remove
                                                      </span>
                                                    </span> */}
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
                                                          handleorderItemQty(
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
                                                          handleorderItemQty(
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
                                                  remove
                                                </span>
                                              </span>
                                            </>
                                          );
                                        }
                                      )
                                    ) : (
                                      <div className="text-primary text-center pt-5 xsm-text text-uppercase">
                                        Select food item to add to the list
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
                                          type="text"
                                          className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center"
                                          value="0"
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
                                          type="text"
                                          className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center"
                                          value="0"
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
                                    <span className="text-capitalize font-weight-bold text-light d-block t-pt-8 t-pb-10">
                                      5000.00
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="t-bg-light-2 t-pr-10">
                                <div className="row gx-2 align-items-center">
                                  <div className="col-6">
                                    <input
                                      type="text"
                                      className="text-capitalize xsm-text d-inline-block font-weight-bold t-pt-5 t-pb-5 form-control rounded-0 text-center fk-paid-input"
                                      placeholder="Insert Paid amount"
                                    />
                                  </div>
                                  <div className="col-6 text-right">
                                    <div className="row gx-2 align-items-center">
                                      <div className="col-6 text-left">
                                        <span className="text-capitalize font-weight-bold d-block">
                                          payable
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="text-capitalize font-weight-bold d-block">
                                          400.00
                                        </span>
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
                                        className="btn btn-info text-uppercase fk-calculator-toggle"
                                      >
                                        <i className="fa fa-calculator"></i>
                                      </button>
                                      <div className="calculator">
                                        <div className="input" id="input"></div>
                                        <div className="buttons">
                                          <div className="operators">
                                            <div>+</div>
                                            <div>-</div>
                                            <div>&times;</div>
                                            <div>&divide;</div>
                                          </div>
                                          <div className="leftPanel">
                                            <div className="numbers">
                                              <div>7</div>
                                              <div>8</div>
                                              <div>9</div>
                                            </div>
                                            <div className="numbers">
                                              <div>4</div>
                                              <div>5</div>
                                              <div>6</div>
                                            </div>
                                            <div className="numbers">
                                              <div>1</div>
                                              <div>2</div>
                                              <div>3</div>
                                            </div>
                                            <div className="numbers">
                                              <div>0</div>
                                              <div>.</div>
                                              <div id="clear">C</div>
                                            </div>
                                          </div>
                                          <div className="equal" id="result">
                                            =
                                          </div>
                                        </div>
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
                                      >
                                        settle
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        className="btn btn-success sm-text text-uppercase font-weight-bold"
                                      >
                                        submit
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
