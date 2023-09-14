import React, { useEffect } from "react";
import { eyeOffIcon, eyeOnIcon } from "@/data/icons";
import LoginLayout from "@/app/components/LoginLayout";
import {
  doubleDecryptSession,
  doubleEncryptSession,
} from "@/services/encryption";
import { useRouter } from "next/router";
import styles from "./register.module.css";

export default function register() {
  const router = useRouter();
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [continueClicked, setContinueClicked] = React.useState(false);

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
    doubleEncryptSession("email", emailValue);
    router.push("/login/identifier");
    return;
  };

  // handle password submit
  const handleSubmit = async () => {
    setContinueClicked(true);
    if (passwordValue.length < 8) {
      setPasswordError(true);
    } else {
      alert("Registering new users disabled currently");
    }
  };

  return (
    <LoginLayout>
      <h1 className={styles.title}>Create an account</h1>
      <div className={styles["input-edit-container"]}>
        <input
          className={styles["email-input-edit"]}
          value={emailValue}
          readOnly
        />
        <button className={styles["edit-button"]} onClick={handleEdit}>
          Edit
        </button>
      </div>
      <div className={styles["input-password-container"]}>
        <div className={styles["input-wrapper"]}>
          <input
            className={`${styles["password-input"]} ${
              passwordError ? styles.error : ""
            }`}
            id="password"
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button
            className={styles["toggle-password"]}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? eyeOffIcon : eyeOnIcon}
          </button>
        </div>

        <label
          className={
            passwordValue || inputFocused
              ? passwordError
                ? styles.errorFilled
                : styles.filled
              : ""
          }
          htmlFor="email"
        >
          Password
        </label>
        {continueClicked && (
          <div className={styles["password-strength-info"]}>
            <p>Your password must contain:</p>
            <ul>
              <li
                className={
                  passwordValue.length < 8
                    ? styles["char-count-red"]
                    : styles["char-count-green"]
                }
              >
                At least 8 characters
              </li>
            </ul>
          </div>
        )}
      </div>
      <button className={styles.signInButton} onClick={handleSubmit}>
        Continue
      </button>
    </LoginLayout>
  );
}
