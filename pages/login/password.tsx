import React, { useEffect } from "react";
import { errorIcon, eyeOffIcon, eyeOnIcon } from "@/data/icons";
import LoginLayout from "@/app/components/LoginLayout";
import axios from "axios";
import "./password.css";
import { useRouter } from "next/router";
import {
  doubleDecryptSession,
  doubleEncryptSession,
} from "@/services/encryption";

export default function password() {
  const router = useRouter();
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [continueClicked, setContinueClicked] = React.useState(false);

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  useEffect(() => {
    const emailValue = doubleDecryptSession("email");
    if (emailValue === "") {
      router.push("/");
      return;
    }
    setEmailValue(emailValue);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPasswordValue(e.target.value);
  };

  const handleEdit = () => {
    doubleEncryptSession("email", emailValue);
    router.push("/login/identifier");
    return;
  };

  // handle password submit
  const handleSubmit = async () => {
    setContinueClicked(true);
    try {
      const { data } = await axios.post("/api/users/login", {
        email: emailValue,
        password: passwordValue,
      });
      const { access_token } = data;
      window.location.assign("/");
    } catch (err) {
      setPasswordError(true);
    }
  };

  return (
    <LoginLayout>
      <h1 className="title">Welcome Back!</h1>
      <div className="input-edit-container">
        <input className="email-input-edit" value={emailValue} readOnly />
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
      </div>
      <div className="input-password-container">
        <div className="input-wrapper">
          <input
            className={`password-input ${passwordError ? "error" : ""}`}
            id="password"
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? eyeOffIcon : eyeOnIcon}
          </button>
        </div>

        <label
          className={
            passwordValue || inputFocused
              ? passwordError
                ? "errorFilled"
                : "filled"
              : ""
          }
          htmlFor="email"
        >
          Password
        </label>
        {continueClicked && (
          <div className="failed-singin-alert">
            {errorIcon} Wrong email or password
          </div>
        )}
      </div>
      <div>
        <a href="/forgot-password">Forgot password? - todo</a>
      </div>
      <button className="signInButton" onClick={handleSubmit}>
        Continue
      </button>
      <div>
        Don't have an account? <a href="/signup">Sign up - todo</a>
      </div>
    </LoginLayout>
  );
}
