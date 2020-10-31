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
  RestaurantLanding,
  RestaurantHome,
  Refresh,
  Login,
  WorkPeriod,
  Pos,
  OrderHistories,
  Customers,
  Kitchen,
  Branch,
  Reports,
  Lang,
  Translation,
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
          <Route path="/dashboard/manage/settings/languages/:code" exact>
            <Translation />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
