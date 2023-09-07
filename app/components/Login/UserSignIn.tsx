import React from "react";
import { appleIcon, facebookIcon, googleIcon } from "@/data/icons";
import "./UserSignIn.css";

const UserSignIn = () => {
  const [emailValue, setEmailValue] = React.useState("");

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmailValue(e.target.value);
  };

  return (
    <div className="main-wrap">
      <div className="container">
        <div className="logo">Logo Here</div> {/* todo Logo placement */}
        <h1 className="title">Reading Alpha</h1>
        <div className="input-container">
          <input
            className="email-input"
            id="email"
            type="email"
            value={emailValue}
            onChange={handleChange}
          />
          <label className={emailValue ? "filled" : ""} htmlFor="email">
            Email Address
          </label>
        </div>
        <button className="continueButton">Continue</button>
        <div className="signup">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </div>{" "}
        {/* todo Sign-up link */}
        <div className="orSeparator">
          <span className="line"></span>
          <span className="orText">OR</span>
          <span className="line"></span>
        </div>
        <button className="socialButton google">
          {googleIcon}
          Continue with Google
        </button>
        <button className="socialButton facebook">
          {facebookIcon}
          Continue with Facebook
        </button>
        <button className="socialButton apple">
          {appleIcon}
          Continue with Apple
        </button>
      </div>
      <div className="footer">
        <a href="/terms">Terms of use</a> |{" "}
        <a href="/privacy">Privacy policy</a>
      </div>
      {/* todo terms / privacy */}
    </div>
  );
};

export default UserSignIn;
