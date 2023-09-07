import React from "react";
import "./UserSignIn.css";

const UserSignIn = () => {
  return (
    <div className="container">
      <div className="logo">Logo Here</div> {/* Logo placement */}
      <h1 className="title">Reading Alpha</h1>
      <div className="email">
        <label htmlFor="email" className="label">
          Email Address
        </label>
        <input id="email" type="email" className="input" />
      </div>
      <button className="continueButton">Continue</button>
      <div className="signup">
        Don&apos;t have an account? <a href="/signup">Sign up</a>
      </div>{" "}
      {/* Sign-up link */}
      <div className="orSeparator">
        <span className="line"></span>
        <span className="orText">OR</span>
        <span className="line"></span>
      </div>
      <button className="socialButton facebook">Continue with Facebook</button>
      <button className="socialButton google">Continue with Google</button>
      <button className="socialButton apple">Continue with Apple</button>
      <div className="footer">
        <a href="/terms">Terms of use</a> |{" "}
        <a href="/privacy">Privacy policy</a>
      </div>
    </div>
  );
};

export default UserSignIn;
