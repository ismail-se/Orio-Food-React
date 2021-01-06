import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//axios and base url
import axios from "axios";
import { BASE_URL } from "./BaseUrl";

//routes
import RestaurantRoute from "./routes/RestaurantRoute";

//functions
import {
  consolee,
  checkPermission,
  getSystemSettings,
} from "./functions/Functions";

//3rd party packages
import { ToastContainer } from "react-toastify";

//pages & includes
import {
  //installation
  Welcome,
  InstallPermission,
  DbSetup,
  ImportDb,
  InstallationUser,
  InstallationCongratulation,
  //landing
  RestaurantLanding,

  //common
  Refresh,
  Login,
  NotFound,
  ForgetPw,
  SetNewPw,
  NoPermission,

  //dashboard
  RestaurantHome,
  UpdateProfile,
  WorkPeriod,

  //pos
  Pos,
  Submitted,
  Settled,
  //
  OrderHistories,
  Customers,
  Kitchen,

  //Reports
  Dashboard,
  Daily,
  Monthly,
  // Yearly,
  ItemWise,
  GroupWise,
  BranchWise,
  UserWise,
  DeptWise,
  ServiceChargeWise,
  DiscountWise,

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
  const { loading, setLoading, generalSettings } = useContext(SettingsContext);
  let { authUserInfo } = useContext(UserContext);

  //state hooks here
  const [credentials, setCredentials] = useState({
    install_no: false,
  });

  //useEffect == componentDidMount()
  useEffect(() => {
    (async () => {
      setLoading(false);
      const url = BASE_URL + "/check-install";
      return axios
        .get(url)
        .then((res) => {
          if (res.data === "NO") {
            setCredentials({
              ...credentials,
              install_no: true,
            });
          }
        })
        .catch((error) => {});
    })();
    if (generalSettings) {
      const favicon = document.getElementById("favicon");
      favicon.href = BASE_URL + getSystemSettings(generalSettings, "favicon");
    }
    // consolee();
  }, [authUserInfo]);
  return (
    <>
      <ToastContainer />
      {/* <Router basename="/khadyo"> */}
      {/* "homepage": "http://localhost/khadyo" */}
      <Router>
        <Navbar />
        <Switch>
          {/* installation */}
          {credentials.install_no && (
            <Route path="/installation" exact>
              <Welcome />
            </Route>
          )}

          {credentials.install_no && (
            <Route path="/installation/permission-chcek" exact>
              <InstallPermission />
            </Route>
          )}

          {credentials.install_no && (
            <Route path="/installation/database-setup" exact>
              <DbSetup />
            </Route>
          )}

          {credentials.install_no && (
            <Route path="/installation/import-database" exact>
              <ImportDb />
            </Route>
          )}

          {credentials.install_no && (
            <Route path="/installation/add-admin-user" exact>
              <InstallationUser />
            </Route>
          )}

          {credentials.install_no && (
            <Route path="/installation/congratulation" exact>
              <InstallationCongratulation />
            </Route>
          )}

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
            <SetNewPw />
          </Route>

          <Route path="/" exact>
            <RestaurantLanding />
          </Route>

          {/* restaurant dashboard pages */}
          <RestaurantRoute path="/dashboard" exact>
            <RestaurantHome />
          </RestaurantRoute>

          <RestaurantRoute path="/update-user-profile" exact>
            <UpdateProfile />
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
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <Dashboard />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/daily-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <Daily />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/monthly-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <Monthly />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          {/* <RestaurantRoute path="/dashboard/yearly-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <Yearly />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute> */}

          <RestaurantRoute path="/dashboard/food-items-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <ItemWise />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/food-group-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <GroupWise />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/branch-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <BranchWise />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/pos-user-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <UserWise />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/dept-tag-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <DeptWise />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/service-charge-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <ServiceChargeWise />
            ) : (
              <NoPermission />
            )}
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/discount-reports" exact>
            {authUserInfo.permissions !== null &&
            checkPermission(authUserInfo.permissions, "Report") ? (
              <DiscountWise />
            ) : (
              <NoPermission />
            )}
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

          {/* Error Routing */}
          <Route component={NotFound} />
          {/* Error Routing */}
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
