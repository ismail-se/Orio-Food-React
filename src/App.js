import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RestaurantHome, Refresh } from "./imports/Pages";
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
          <Route path="/" exact>
            <RestaurantHome />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
