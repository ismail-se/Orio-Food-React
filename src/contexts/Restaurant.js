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

  //table
  const [tableList, setTableList] = useState(null);
  const [tableForSearch, setTableforSearch] = useState(null);

  //table
  const [deptTagList, setDeptTagList] = useState(null);
  const [deptTagForSearch, setDeptTagForSearch] = useState(null);

  //Payment Type
  const [paymentTypeList, setPaymentTypeList] = useState(null);
  const [paymentTypeForSearch, setPaymentTypeforSearch] = useState(null);

  //work period
  const [workPeriodList, setWorkPeriodList] = useState(null);
  const [workPeriodForSearch, setWorkPeriodListForSearch] = useState(null);

  //submitted orders
  const [submittedOrders, setSubmittedOrders] = useState(null);
  const [submittedOrdersForSearch, setSubmittedOrdersForSearch] = useState(
    null
  );

  //settled orders
  const [settledOrders, setSettledOrders] = useState(null);
  const [settledOrdersForSearch, setSettledOrdersForSearch] = useState(null);

  //kitchen new orders
  const [kithcenNewOrders, setKithcenNewOrders] = useState(null);

  //useEffect- to get data on render
  useEffect(() => {
    //call- unauthenticated

    //call if authenticated
    if (getCookie() !== undefined) {
      getBranch();
      getTable();
      getDeptTag();
      getPaymentType();
      getWorkPeriod();
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

  //get tables
  const getTable = () => {
    setLoading(true);
    const branchUrl = BASE_URL + "/settings/get-table";
    return axios
      .get(branchUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setTableList(res.data[0]);
        setTableforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated tables
  const setPaginatedTable = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-table?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setTableList(res.data[0]);
        setTableforSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get payment types
  const getPaymentType = () => {
    setLoading(true);
    const paymentTypeUrl = BASE_URL + "/settings/get-payment-type";
    return axios
      .get(paymentTypeUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setPaymentTypeList(res.data[0]);
        setPaymentTypeforSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated payment types
  const setPaginatedPaymentType = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-payment-type?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setPaymentTypeList(res.data[0]);
        setPaymentTypeforSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get dept Tag
  const getDeptTag = () => {
    setLoading(true);
    const deptTagUrl = BASE_URL + "/settings/get-dept-tag";
    return axios
      .get(deptTagUrl, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setDeptTagList(res.data[0]);
        setDeptTagForSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated dept Tag
  const setPaginatedDeptTag = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-dept-tag?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setDeptTagList(res.data[0]);
        setDeptTagForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get work period
  const getWorkPeriod = () => {
    setLoading(true);
    const url = BASE_URL + "/settings/get-work-period";
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setWorkPeriodList(res.data[0]);
        setWorkPeriodListForSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated work period
  const setPaginatedWorkPeriod = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-work-period?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setWorkPeriodList(res.data[0]);
        setWorkPeriodListForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get submitted orders- not settled
  const getSubmittedOrders = () => {
    setLoading(true);
    const url = BASE_URL + "/settings/get-submitted-orders";
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setSubmittedOrders(res.data[0]);
        setSubmittedOrdersForSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated submitted orders- not settled
  const setPaginatedSubmittedOrders = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-submitted-orders?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setSubmittedOrders(res.data[0]);
        setSubmittedOrdersForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get settled orders
  const getSettledOrders = () => {
    setLoading(true);
    const url = BASE_URL + "/settings/get-settled-orders";
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setSettledOrders(res.data[0]);
        setSettledOrdersForSearch(res.data[1]);
        setLoading(false);
      });
  };

  // get paginated settled orders
  const setPaginatedSettledOrders = (pageNo) => {
    setDataPaginating(true);
    const url = BASE_URL + "/settings/get-settled-orders?page=" + pageNo;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setSettledOrders(res.data[0]);
        setSettledOrdersForSearch(res.data[1]);
        setDataPaginating(false);
      })
      .catch(() => {});
  };

  //get kithcen new orders
  const getKitchenNewOrders = () => {
    setLoading(true);
    const url = BASE_URL + "/settings/get-new-orders";
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${getCookie()}` },
      })
      .then((res) => {
        setKithcenNewOrders(res.data[0]);
        setLoading(false);
      });
  };

  return (
    <RestaurantContext.Provider
      value={{
        //common
        loading,
        setLoading,
        //branch
        getBranch,
        branchList,
        setBranchList,
        setPaginatedBranch,
        branchForSearch,
        setBranchforSearch,

        //table
        getTable,
        tableList,
        setTableList,
        setPaginatedTable,
        tableForSearch,
        setTableforSearch,

        //dept-tag
        getDeptTag,
        deptTagList,
        setDeptTagList,
        setPaginatedDeptTag,
        deptTagForSearch,
        setDeptTagForSearch,

        //payment types
        getPaymentType,
        paymentTypeList,
        setPaymentTypeList,
        setPaginatedPaymentType,
        paymentTypeForSearch,
        setPaymentTypeforSearch,

        //work period
        getWorkPeriod,
        workPeriodList,
        setWorkPeriodList,
        setPaginatedWorkPeriod,
        workPeriodForSearch,
        setWorkPeriodListForSearch,

        //submitted orders
        getSubmittedOrders,
        submittedOrders,
        setSubmittedOrders,
        setPaginatedSubmittedOrders,
        submittedOrdersForSearch,
        setSubmittedOrdersForSearch,

        //settled orders
        getSettledOrders,
        settledOrders,
        setSettledOrders,
        setPaginatedSettledOrders,
        settledOrdersForSearch,
        setSettledOrdersForSearch,

        //kitchen dashboard
        getKitchenNewOrders,
        kithcenNewOrders,
        setKithcenNewOrders,

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
