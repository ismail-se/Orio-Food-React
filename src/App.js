import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  RestaurantLanding,
  RestaurantHome,
  Refresh,
  WorkPeriod,
  Pos,
  OrderHistories,
  Customers,
  Kitchen,
  Branch,
  Reports,
  Lang,
} from "./imports/Pages";

import { Navbar, Footer } from "./imports/Components";
import { consolee } from "./functions/Functions";
import { ToastContainer } from "react-toastify";
function App() {
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
          <Route path="/" exact>
            <RestaurantLanding />
          </Route>
          {/* restaurant dashboard pages */}
          <Route path="/dashboard" exact>
            <RestaurantHome />
          </Route>
          <Route path="/dashboard/work-periods" exact>
            <WorkPeriod />
          </Route>
          <Route path="/dashboard/pos" exact>
            <Pos />
          </Route>
          <Route path="/dashboard/orders" exact>
            <OrderHistories />
          </Route>
          <Route path="/dashboard/customers" exact>
            <Customers />
          </Route>
          <Route path="/dashboard/kitchen" exact>
            <Kitchen />
          </Route>
          <Route path="/dashboard/branches" exact>
            <Branch />
          </Route>
          <Route path="/dashboard/reports" exact>
            <Reports />
          </Route>
          <Route path="/dashboard/manage/settings/languages" exact>
            <Lang />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
