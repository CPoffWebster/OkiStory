import React from "react";
import "./SignUp.css";
import { errorIcon } from "@/data/icons";

export interface SignUpProps {
  emailValue: string;
}

const SignUp: React.FC<SignUpProps> = ({ emailValue }) => {
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

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
    // const isEmailValid = validator.isEmail(emailValue);
    // console.log(isEmailValid, emailValue);
    setPasswordError(true); // Set the error state based on email validity
  };

  return (
    <>
      <h1>Create an account</h1>
      <div className="input-edit-container">
        <input className="email-input-edit" value={emailValue} readOnly />
        <button className="edit-button">Edit</button>
      </div>
      <div className="input-password-container">
        <input
          className={`password-input ${passwordError ? "error" : ""}`}
          id="password"
          type={showPassword ? "text" : "password"}
          value={passwordValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showPassword.toString()}
        <button className="toggle-password" onClick={togglePasswordVisibility}>
          {showPassword ? "Hide" : "Show"}
        </button>
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
        {passwordError && (
          <div className="errorText">{errorIcon} password error</div>
        )}
      </div>
      <button className="signInButton" onClick={handleSubmit}>
        Sign In
      </button>
    </>
  );
};

export default SignUp;
