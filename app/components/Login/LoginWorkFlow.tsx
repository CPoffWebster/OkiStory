import React from "react";
import "./LoginWorkFlow.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import WelcomeBack from "./WelcomeBack";

const LoginWorkFlow = () => {
  return (
    <div className="main-wrap">
      <div className="logo">Logo Here</div> {/* todo Logo placement */}
      <div className="container">
        {/* <SignIn /> */}
        {/* <SignUp emailValue={"test2@email.com"} /> */}
        <WelcomeBack emailValue={"test2@email.com"} />
      </div>
      <div className="footer">
        <a href="/terms">Terms of use</a> |{" "}
        <a href="/privacy">Privacy policy</a>
      </div>
      {/* todo terms / privacy */}
    </div>
  );
};

export default LoginWorkFlow;
