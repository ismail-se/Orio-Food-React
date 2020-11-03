//common pages
import Refresh from "../resources/common/Refresh";
import Login from "../resources/common/Login";
//public page
import RestaurantLanding from "../resources/restaurant/public/RestaurantLanding";

//private pages
import RestaurantHome from "../resources/restaurant/auth/RestaurantHome";
import WorkPeriod from "../resources/restaurant/auth/WorkPeriod";
import Pos from "../resources/restaurant/auth/Pos";
import OrderHistories from "../resources/restaurant/auth/OrderHistories";
import Customers from "../resources/restaurant/auth/Customers";
import Kitchen from "../resources/restaurant/auth/Kitchen";
import Branch from "../resources/restaurant/auth/Branch";
import Reports from "../resources/restaurant/auth/Reports";
//from restaurant-auth-manage
import Lang from "../resources/restaurant/auth/manage/settings/Lang";
import Translation from "../resources/restaurant/auth/manage/settings/Translation";
import Smtp from "../resources/restaurant/auth/manage/settings/Smtp";
import Permissions from "../resources/restaurant/auth/manage/user/Permissions";

export {
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
  //manage
  Lang,
  Translation,
  Smtp,
  Permissions,
};
