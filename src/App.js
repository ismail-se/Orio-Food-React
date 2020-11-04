import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//routes
import RestaurantRoute from "./routes/RestaurantRoute";

//functions
import { consolee } from "./functions/Functions";

//3rd party packages
import { ToastContainer } from "react-toastify";

//pages & includes
import {
  //landing
  RestaurantLanding,
  //common
  Refresh,
  Login,
  //dashboard
  RestaurantHome,
  WorkPeriod,
  Pos,
  OrderHistories,
  Customers,
  Kitchen,
  Branch,
  Reports,
  //manage->settings
  Lang,
  Translation,
  Smtp,
  //manage->settings
  Waiter,
  Permissions,
  //manage->settings
  BranchCrud,
  TableCrud,
} from "./imports/Pages";
import { Navbar, Footer } from "./imports/Components";

//context consumer
import { SettingsContext } from "./contexts/Settings";

function App() {
  //getting context values here
  const { loading, setLoading } = useContext(SettingsContext);

  //useEffect == componentDidMount()
  useEffect(() => {
    // consolee();
  }, []);
  return (
    <>
      <ToastContainer />
      <Router>
        <Navbar />
        <Switch>
          <Route path="/refresh" exact>
            <Refresh />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/" exact>
            <RestaurantLanding />
          </Route>

          {/* restaurant dashboard pages */}
          <RestaurantRoute path="/dashboard" exact>
            <RestaurantHome />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/work-periods" exact>
            <WorkPeriod />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/pos" exact>
            <Pos />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/orders" exact>
            <OrderHistories />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/customers" exact>
            <Customers />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/kitchen" exact>
            <Kitchen />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/branches" exact>
            <Branch />
          </RestaurantRoute>
          <RestaurantRoute path="/dashboard/reports" exact>
            <Reports />
          </RestaurantRoute>

          {/* Manage menu routes */}

          {/* Users */}
          <RestaurantRoute path="/dashboard/manage/user/waiter" exact>
            <Waiter />
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/roles-and-permissions" exact>
            <Permissions />
          </RestaurantRoute>

          {/* Restairant */}
          <RestaurantRoute path="/dashboard/manage/restaurant/branches" exact>
            <BranchCrud />
          </RestaurantRoute>

          <RestaurantRoute path="/dashboard/manage/restaurant/tables" exact>
            <TableCrud />
          </RestaurantRoute>

          {/* Settings */}
          <RestaurantRoute path="/dashboard/manage/settings/languages" exact>
            <Lang />
          </RestaurantRoute>
          <RestaurantRoute
            path="/dashboard/manage/settings/languages/:code"
            exact
          >
            <Translation />
          </RestaurantRoute>
          <RestaurantRoute
            path="/dashboard/manage/settings/smtp-settings"
            exact
          >
            <Smtp />
          </RestaurantRoute>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
