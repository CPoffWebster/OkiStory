import React, { useEffect } from "react";
import { appleIcon, errorIcon, facebookIcon, googleIcon } from "@/data/icons";
var validator = require("validator");
import LoginLayout from "@/app/components/LoginLayout";
import { useRouter } from "next/router";
import {
  doubleDecryptSession,
  doubleEncryptSession,
} from "@/services/encryption";
import axios from "axios";
import "./identifier.css";

export default function identifier() {
  const router = useRouter();
  const [emailValue, setEmailValue] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  useEffect(() => {
    const emailValue = doubleDecryptSession("email");
    setEmailValue(emailValue);
  }, []);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmailValue(e.target.value);
  };

  // handle email submit
  const handleSubmit = async () => {
    const isEmailValid = validator.isEmail(emailValue);
    if (isEmailValid) {
      const exists = await axios.post("/api/users/verifyUser", {
        email: emailValue,
      });
      doubleEncryptSession("email", emailValue);
      if (exists.data) router.push("/login/password");
      else router.push("/login/register");
      return;
    }
    setEmailError(!isEmailValid); // Set the error state based on email validity
  };

  return (
    <LoginLayout>
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
    </LoginLayout>
  );
}
