import React from "react";

const Login = () => {
  return (
    <>
      <main>
        <div className="fk-global-access">
          <div className="d-none d-lg-block">
            <div className="fk-global-img text-center">
              <img
                src="assets/img/sign-in.png"
                alt="foodkhan"
                className="img-fluid mx-auto fk-global-img__is"
              />
              <img
                src="assets/img/obj-1.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-1"
              />
              <img
                src="assets/img/obj-8.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-2"
              />
              <img
                src="assets/img/obj-7.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-6"
              />
              <img
                src="assets/img/obj-9.png"
                alt="foodkhan"
                className="img-fluid fk-global-img__obj fk-global-img__obj-8"
              />
            </div>
          </div>
          <div className="container my-md-auto">
            <div className="row">
              <div className="col-md-6">
                <div className="fk-brand--footer fk-brand--footer-sqr">
                  <a href="index.html" className="t-link w-100 t-h-50">
                    <span className="bg-primary fk-brand--footer-img fk-brand__img--fk"></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 col-lg-6 col-xl-4 t-mt-50">
                <div className="fk-global-form">
                  <h3 className="mt-0 text-capitalize font-weight-bold">
                    sign in
                  </h3>
                  <p className="sm-text">
                    Enter your details to create your account
                  </p>
                  <form action="#">
                    <div className="row">
                      <div className="col-12 t-mb-15">
                        <input
                          type="email"
                          placeholder="Email Address"
                          className="form-control border-0 rounded-1"
                        />
                      </div>
                      <div className="col-12 t-mb-15">
                        <input
                          type="password"
                          placeholder="Password"
                          className="form-control border-0 rounded-1"
                        />
                      </div>
                      <div className="col-6 t-mb-15">
                        <label className="mx-checkbox">
                          <input
                            type="checkbox"
                            className="mx-checkbox__input mx-checkbox__input-solid mx-checkbox__input-solid--danger mx-checkbox__input-sm"
                            name="variation"
                          />
                          <span className="mx-checkbox__text text-capitalize t-text-heading t-ml-8">
                            Remember Me
                          </span>
                        </label>
                      </div>
                      <div className="col-6 t-mb-15 text-right">
                        <a href="#" className="t-link sm-text">
                          Forgot password?
                        </a>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-center">
                          <div className="t-mr-8">
                            <a
                              href="verify-code.html"
                              className="btn btn-success sm-text text-uppercase"
                            >
                              sign in
                            </a>
                          </div>
                          <div className="t-mr-8">
                            <button
                              type="button"
                              className="btn btn-secondary sm-text text-uppercase"
                            >
                              <i
                                className="fa fa-facebook"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-primary sm-text text-uppercase"
                            >
                              <i
                                className="fa fa-google"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="fk-global-footer">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-7 t-mb-15 mb-md-0">
                  <ul className="t-list d-flex flex-wrap justify-content-center justify-content-md-start">
                    <li className="t-list__item">
                      <a href="#card-2" className="t-link fk-global-link">
                        help
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-3" className="t-link fk-global-link">
                        press
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-4" className="t-link fk-global-link">
                        jobs
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-5" className="t-link fk-global-link">
                        privacy
                      </a>
                    </li>
                    <li className="t-list__item">
                      <a href="#card-6" className="t-link fk-global-link">
                        terms
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-5 text-center text-md-right">
                  <p className="xsm-text text-uppercase mb-0">
                    &copy; Food Khan | All rights reserved | 2020
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
