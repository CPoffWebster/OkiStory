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
import styles from "./identifier.module.css";

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
      <h1 className={styles.title}>Reading Alpha</h1>
      <div className={styles["input-container"]}>
        <input
          className={`${styles["email-input"]} ${
            emailError ? styles.error : ""
          }`}
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
                ? styles.errorFilled
                : styles.filled
              : ""
          }
          htmlFor="email"
        >
          Email Address
        </label>
        {emailError && (
          <div className={styles.errorText}>
            {errorIcon} Invalid email address
          </div>
        )}
      </div>
      <button className={styles.continueButton} onClick={handleSubmit}>
        Continue
      </button>
      <div className={styles.signup}>
        Don&apos;t have an account? <a href="/signup">Sign up</a>
      </div>
      <div className={styles.orSeparator}>
        <span className={styles.line}></span>
        <span className={styles.orText}>OR</span>
        <span className={styles.line}></span>
      </div>
      <button className={`${styles.socialButton} ${styles.google}`}>
        {googleIcon}
        Continue with Google
      </button>
      <button className={`${styles.socialButton} ${styles.facebook}`}>
        {facebookIcon}
        Continue with Facebook
      </button>
      <button className={`${styles.socialButton} ${styles.apple}`}>
        {appleIcon}
        Continue with Apple
      </button>
    </LoginLayout>
  );
}
