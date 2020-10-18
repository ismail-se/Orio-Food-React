// import axios from "axios";
// import { BASE_URL } from "../BaseUrl";

//translation functions
const _t = (text) => {
  // const url = BASE_URL + `/api/languages`;
  // let formData = {
  //   key: text,
  // };
  // axios.post(url, formData);
  return text;
};

//console clear and dummy text
const consolee = () => {
  var cssStop = "color: Red;" + "font-size: 50px;" + "font-weight: bold;";
  var cssText = "color: Black;" + "font-size: 18px;" + "font-weight: bold;";
  console.clear();
  console.log("%cStop!", cssStop);
  console.log(
    "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or hack someone's account, it is a scam and will give them access to many of your accounts.",
    cssText
  );
};

export { _t, consolee };
