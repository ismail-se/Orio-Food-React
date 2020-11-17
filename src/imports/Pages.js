//common pages
import Refresh from "../resources/common/Refresh";
import Login from "../resources/common/Login";
import NoPermission from "../resources/common/NoPermission";

//public page
import RestaurantLanding from "../resources/restaurant/public/RestaurantLanding";

//private pages
import RestaurantHome from "../resources/restaurant/auth/RestaurantHome";
import Pos from "../resources/restaurant/auth/Pos";
import OrderHistories from "../resources/restaurant/auth/OrderHistories";
import Kitchen from "../resources/restaurant/auth/Kitchen";
import Branch from "../resources/restaurant/auth/Branch";
import Reports from "../resources/restaurant/auth/Reports";

//work periods
import WorkPeriod from "../resources/restaurant/auth/workPeriod/WorkPeriod";
//customers
import Customers from "../resources/restaurant/auth/customer/Customers";

//from restaurant-auth-manage
//-food
import GroupCrud from "../resources/restaurant/auth/manage/food/GroupCrud";
import UnitCrud from "../resources/restaurant/auth/manage/food/UnitCrud";
import VariationCrud from "../resources/restaurant/auth/manage/food/VariationCrud";
import PropertyCrud from "../resources/restaurant/auth/manage/food/PropertyCrud";
import PropertyItemCrud from "../resources/restaurant/auth/manage/food/PropertyItemCrud";
import FoodItemCrud from "../resources/restaurant/auth/manage/food/FoodItemCrud";
import AllItemList from "../resources/restaurant/auth/manage/food/AllItemList";

//-settings
import Currency from "../resources/restaurant/auth/manage/settings/Currency";
import Lang from "../resources/restaurant/auth/manage/settings/Lang";
import Translation from "../resources/restaurant/auth/manage/settings/Translation";
import Smtp from "../resources/restaurant/auth/manage/settings/Smtp";
import General from "../resources/restaurant/auth/manage/settings/General";

//-users
import Permissions from "../resources/restaurant/auth/manage/user/Permissions";
import Waiter from "../resources/restaurant/auth/manage/user/Waiter";
import CustomerCrud from "../resources/restaurant/auth/manage/user/CustomerCrud";
import AdminStaffCrud from "../resources/restaurant/auth/manage/user/AdminStaffCrud";

//-restairantDetails
import BranchCrud from "../resources/restaurant/auth/manage/restaurantDetails/BranchCrud";
import TableCrud from "../resources/restaurant/auth/manage/restaurantDetails/TableCrud";
import DeptTagCrud from "../resources/restaurant/auth/manage/restaurantDetails/DeptTagCrud";
import PaymentTypeCrud from "../resources/restaurant/auth/manage/restaurantDetails/PaymentTypeCrud";

export {
  //landing
  RestaurantLanding,
  //common
  Refresh,
  Login,
  NoPermission,
  //dashboard
  RestaurantHome,
  WorkPeriod,
  Pos,
  OrderHistories,
  Customers,
  Kitchen,
  Branch,
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
  //manage->users
  AdminStaffCrud,
  Waiter,
  Permissions,
  CustomerCrud,
  //manage->restaurantDetails
  BranchCrud,
  TableCrud,
  DeptTagCrud,
  PaymentTypeCrud,
};
