import React from "react";
import { errorIcon, eyeOffIcon, eyeOnIcon } from "@/data/icons";
import axios from "axios";
import "./WelcomeBack.css";

export interface WelcomeBackProps {
  emailValue: string;
}

const WelcomeBack: React.FC<WelcomeBackProps> = ({ emailValue }) => {
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [continueClicked, setContinueClicked] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPasswordValue(e.target.value);
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
      console.log("Success", access_token);
      window.location.assign("/");
    } catch (err) {
      setPasswordError(true);
    }
  };

  return (
    <>
      <h1 className="title">Welcome Back!</h1>
      <div className="input-edit-container">
        <input className="email-input-edit" value={emailValue} readOnly />
        <button className="edit-button">Edit</button>
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
      <button className="signInButton" onClick={handleSubmit}>
        Continue
      </button>
    </>
  );
};

export default WelcomeBack;
