import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//routes
import RestaurantRoute from "./routes/RestaurantRoute";

//functions
import { consolee, checkPermission } from "./functions/Functions";

//3rd party packages
import { ToastContainer } from "react-toastify";

//pages & includes
import {
  //landing
  RestaurantLanding,

  //common
  Refresh,
  Login,
  ForgetPw,
  NoPermission,

  //dashboard
  RestaurantHome,
  WorkPeriod,

  //pos
  Pos,
  Submitted,
  Settled,
  //
  OrderHistories,
  Customers,
  Kitchen,
  Reports,

  //manage->food
  GroupCrud,
  UnitCrud,
  VariationCrud,
  PropertyCrud,
  PropertyItemCrud,
  FoodItemCrud,
  AllItemList,

  //manage->settings
  Currency,
  Lang,
  Translation,
  Smtp,
  General,

  //manage->user
  AdminStaffCrud,
  Waiter,
  Permissions,
  CustomerCrud,

  //manage->restaurantDetails
  BranchCrud,
  TableCrud,
  DeptTagCrud,
  PaymentTypeCrud,
} from "./imports/Pages";
import { Navbar, Footer } from "./imports/Components";

//context consumer
import { SettingsContext } from "./contexts/Settings";
import { UserContext } from "./contexts/User";

function App() {
  //getting context values here
  const { loading, setLoading } = useContext(SettingsContext);
  let { authUserInfo } = useContext(UserContext);

  //useEffect == componentDidMount()
  useEffect(() => {
    // consolee();
  }, [authUserInfo]);
  return (
    <>
      <ToastContainer />
      <Router>
        <Navbar />
        <Switch>
          {/* common */}
          <Route path="/refresh" exact>
            <Refresh />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/reset-password" exact>
            <ForgetPw />
          </Route>

          <Route path="/set-new-password/:token" exact>
            <ForgetPw />
          </Route>

          <Route path="/" exact>
            <RestaurantLanding />
          </Route>

          {/* restaurant dashboard pages */}
          <RestaurantRoute path="/dashboard" exact>
            <RestaurantHome />
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/work-periods" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Work period") ? (
              <WorkPeriod />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/pos" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "POS") ? (
              <Pos />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/pos/submitted" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "POS") ? (
              <Submitted />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/pos/settled" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "POS") ? (
              <Settled />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/orders" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Order history") ? (
              <OrderHistories />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/customers" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Customer") ? (
              <Customers />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/kitchen" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Kitchen") ? (
              <Kitchen />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/reports" exact>
            <Reports />
          </RestaurantRoute>

          {/* Manage routes */}
          {/* food */}
          <RestaurantRoute path="/dashboard/manage/food/groups" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <GroupCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          {/* <RestaurantRoute path="/dashboard/manage/food/units" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <UnitCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute> */}

          <RestaurantRoute path="/dashboard/manage/food/variations" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <VariationCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/food/properties" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <PropertyCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/food/properties/:slug" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <PropertyItemCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/food/add-new" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <FoodItemCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/food/all-items" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <AllItemList />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          {/* Users */}
          <RestaurantRoute path="/dashboard/manage/user/customers" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <CustomerCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/user/admin-staff" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <AdminStaffCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/user/waiters" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <Waiter />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/roles-and-permissions" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <Permissions />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          {/* Restaurant */}
          <RestaurantRoute path="/dashboard/manage/restaurant/branches" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <BranchCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/restaurant/tables" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <TableCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/restaurant/dept-tags" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <DeptTagCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute
            path="/dashboard/manage/restaurant/payment-type"
            exact
          >
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <PaymentTypeCrud />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          {/* Settings */}

          <RestaurantRoute path="/dashboard/manage/settings/currencies" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <Currency />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/settings/languages" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <Lang />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute
            path="/dashboard/manage/settings/languages/:code"
            exact
          >
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <Translation />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute
            path="/dashboard/manage/settings/smtp-settings"
            exact
          >
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <Smtp />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute
            path="/dashboard/manage/settings/general-settings"
            exact
          >
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Manage") ? (
              <General />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
