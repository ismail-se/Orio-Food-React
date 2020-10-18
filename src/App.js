import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  RestaurantHome,
  Refresh,
  WorkPeriod,
  Pos,
  OrderHistories,
  Customers,
  Kitchen,
  Branch,
  Reports,
  Settings,
} from "./imports/Pages";
import { Navbar, Footer } from "./imports/Components";
import { consolee } from "./functions/Functions";
function App() {
  useEffect(() => {
    // consolee();
  }, []);
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/refresh" exact>
            <Refresh />
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
          <Route path="/dashboard/settings" exact>
            <Settings />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
