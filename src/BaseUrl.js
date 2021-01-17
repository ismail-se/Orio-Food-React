// for localhost development
// export let BASE_URL =
//   window.location.protocol +
//   "//" +
//   window.location.hostname +
//   "/foodkhan/laravel/public";

//for localhost production
// export let BASE_URL =
//   window.location.protocol +
//   "//" +
//   window.location.hostname +
//   `${
//     window.location.port !== ""
//       ? `:${window.location.port}/khadyo/laravel`
//       : "/khadyo/laravel"
//   }`;
//for khadyo.com
// export let BASE_URL =
//   window.location.protocol + "//" + window.location.hostname + "/laravel";

// for production
export let BASE_URL =
  window.location.protocol +
  "//" +
  window.location.hostname +
  `${
    window.location.port !== ""
      ? `:${window.location.port}`
      : `${!window.location.href.includes(".test") ? "/public" : ""}`
  }`;
