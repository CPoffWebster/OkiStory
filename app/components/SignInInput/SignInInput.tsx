import React, { FocusEvent, ChangeEvent, useState, useEffect } from "react";
import styles from "./SignInInput.module.css";
import { errorIcon, eyeOffIcon, eyeOnIcon } from "@/data/icons";

interface SignInInputProps {
  value: string;
  error: boolean;
  label: string;
  type: string;
  errorText: string;
  showPasswordToggle?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SignInInput: React.FC<SignInInputProps> = ({
  value,
  error,
  label,
  type,
  errorText,
  showPasswordToggle = false,
  onChange,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const actualType = showPassword ? "text" : type;

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (value || error) {
      setInputFocused(true);
    }
  }, [value, error]);

  return (
    <div className={styles["input-container"]}>
      <div
        className={`${styles["input-wrapper"]} ${error ? styles.error : ""}`}
      >
        <input
          className={styles["input"]}
          id={label}
          type={actualType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showPasswordToggle && (
          <button
            className={styles["toggle-password"]}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? eyeOffIcon : eyeOnIcon}
          </button>
        )}
      </div>
      <label
        className={
          inputFocused ? (error ? styles.errorFilled : styles.filled) : ""
        }
        htmlFor={label}
      >
        {label}
      </label>
      {error && (
        <div className={styles.errorText}>
          {errorIcon} {errorText}
        </div>
      )}
    </div>
  );
};
