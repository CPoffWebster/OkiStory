import React from "react";
import { appleIcon, errorIcon, facebookIcon, googleIcon } from "@/data/icons";
var validator = require("validator");
import "./SignIn.css";

const SignIn = () => {
  const [emailValue, setEmailValue] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmailValue(e.target.value);
  };

  // handle email submit
  const handleSubmit = async () => {
    const isEmailValid = validator.isEmail(emailValue);
    console.log(isEmailValid, emailValue);
    setEmailError(!isEmailValid); // Set the error state based on email validity
  };

  return (
    <>
      <h1 className="title">Reading Alpha</h1>
      <div className="input-container">
        <input
          className={`email-input ${emailError ? "error" : ""}`}
          id="email"
          type="email"
          value={emailValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <label
          className={
            emailValue || inputFocused
              ? emailError
                ? "errorFilled"
                : "filled"
              : ""
          }
          htmlFor="email"
        >
          Email Address
        </label>
        {emailError && (
          <div className="errorText">{errorIcon} Invalid email address</div>
        )}
      </div>
      <button className="continueButton" onClick={handleSubmit}>
        Continue
      </button>
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
    </>
  );
};

export default SignIn;
