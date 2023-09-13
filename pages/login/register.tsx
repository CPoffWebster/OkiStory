import React from "react";
import { eyeOffIcon, eyeOnIcon } from "@/data/icons";
import "./register.css";
import LoginLayout from "@/app/components/LoginLayout";
import { GetServerSideProps } from "next";
import { decrypt, encrypt } from "@/services/encryption";
import { useRouter } from "next/router";

export interface SignUpProps {
  emailValue: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const emailValue = decrypt(context.query.state as string);
  return {
    props: { emailValue }, // will be passed to the page component as props
  };
};

export default function register(props: { emailValue: string }) {
  const router = useRouter();
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
    if (passwordError && e.target.value.length >= 8) {
      setPasswordError(false);
    }
  };

  const handleEdit = () => {
    router.push(`/login/identifier?state=${encrypt(props.emailValue)}`);
    return;
  };

  // handle password submit
  const handleSubmit = async () => {
    setContinueClicked(true);
    if (passwordValue.length < 8) {
      setPasswordError(true);
    }
  };

  return (
    <LoginLayout>
      <h1 className="title">Create an account</h1>
      <div className="input-edit-container">
        <input className="email-input-edit" value={props.emailValue} readOnly />
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
          <div className="password-strength-info">
            <p>Your password must contain:</p>
            <ul>
              <li
                className={
                  passwordValue.length < 8
                    ? "char-count-red"
                    : "char-count-green"
                }
              >
                At least 8 characters
              </li>
            </ul>
          </div>
        )}
      </div>
      <button className="signInButton" onClick={handleSubmit}>
        Continue
      </button>
    </LoginLayout>
  );
}
