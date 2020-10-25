import React from "react";
import { NavLink } from "react-router-dom";

/*translation functions*/
const _t = (text) => {
  /* const url = BASE_URL + `/api/languages`;
  let formData = {
  key: text,
  };
  axios.post(url, formData);
  */
  return text;
};

/*console functions, clear and dummy text like facebook*/
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

/*navlink functions start here*/
//navbar links
const navbarHrefLink = (redirectTo) => {
  if (window.location.pathname === redirectTo) {
    return (
      <NavLink
        to={{ pathname: "/refresh", state: redirectTo }}
        exact
        className="t-link w-100"
      >
        <span className="bg-primary fk-brand__img fk-brand__img--fk"></span>
      </NavLink>
    );
  } else {
    return (
      <NavLink to={redirectTo} exact className="t-link w-100">
        <span className="bg-primary fk-brand__img fk-brand__img--fk"></span>
      </NavLink>
    );
  }
};
//footer logo link
const footerHrefLink = (redirectTo) => {
  if (window.location.pathname === redirectTo) {
    return (
      <NavLink
        to={{ pathname: "/refresh", state: redirectTo }}
        exact
        className="t-link w-100 t-h-80"
      >
        <span
          className="bg-primary fk-brand--footer-img fk-brand__img--fk"
          style={{
            backgroundImage: `url("/assets/img/foodkhan.png")`,
          }}
        ></span>
      </NavLink>
    );
  } else {
    return (
      <NavLink to={redirectTo} className="t-link w-100 t-h-80">
        <span
          className="bg-primary fk-brand--footer-img fk-brand__img--fk"
          style={{
            backgroundImage: `url("/assets/img/foodkhan.png")`,
          }}
        ></span>
      </NavLink>
    );
  }
};

//restaurant menu links
const restaurantMenuLink = (
  img,
  imgAlt,
  icon,
  infoTextColor,
  info,
  title,
  redirectTo
) => {
  return (
    <NavLink to={redirectTo} className="t-link product-card t-bg-white">
      <div className="product-card__head">
        <img src={img} alt={imgAlt} className="img-fluid" />
      </div>
      <div className="product-card__body">
        <div className="product-card__add">
          <span className="product-card__add-icon">
            <span className="las la-plus"></span>
          </span>
        </div>
        <span
          className={`product-card__sub-title ${infoTextColor} text-uppercase`}
        >
          <span className={icon}></span> {info}
        </span>
        <span className="product-card__title text-capitalize">{title}</span>
      </div>
    </NavLink>
  );
};

export { _t, consolee, navbarHrefLink, footerHrefLink, restaurantMenuLink };
