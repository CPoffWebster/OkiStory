import React, { useEffect, forwardRef, useState } from "react";
import styles from "./SignInInput.module.css";
import { MDCTextField } from "@material/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import { errorIcon, eyeOnIcon, eyeOffIcon } from "@/data/icons";
import { Tooltip } from "react-tooltip";

interface SignInInputProps {
  value: string;
  error: boolean;
  label: string;
  type: string;
  errorText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void | Promise<void>;
  showPasswordToggle?: boolean;
}

const SignInInput = forwardRef<HTMLInputElement, SignInInputProps>(
  (props, ref) => {
    const {
      value,
      error,
      label,
      type,
      errorText,
      onChange,
      handleSubmit,
      showPasswordToggle = false,
    } = props;
    const [showPassword, setShowPassword] = useState(false);
    const actualType = showPassword ? "text" : type;

    const labelRef = React.useRef<HTMLLabelElement>(null);

    useEffect(() => {
      if (labelRef.current) {
        new MDCTextField(labelRef.current);
      }
    }, []);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={styles["input-container"]}>
        <label
          ref={labelRef}
          className={`mdc-text-field mdc-text-field--outlined ${styles["mdc-text-field"]}`}
        >
          <span className="mdc-notched-outline">
            <span className="mdc-notched-outline__leading"></span>
            <span className="mdc-notched-outline__notch">
              <span className="mdc-floating-label" id={`${label}-id`}>
                {label}
              </span>
            </span>
            <span className="mdc-notched-outline__trailing"></span>
          </span>
          <input
            ref={ref}
            type={actualType}
            style={{ paddingRight: showPasswordToggle ? "50px" : "0" }}
            className={`mdc-text-field__input ${
              error ? "mdc-text-field--invalid" : ""
            }`}
            aria-labelledby={`${label}-id`}
            value={value}
            onChange={onChange}
            onKeyDown={async (event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
          {showPasswordToggle && (
            <button
              className={styles["toggle-password"]}
              onClick={togglePasswordVisibility}
              data-tooltip-id="my-tooltip-1"
            >
              {showPassword ? eyeOffIcon : eyeOnIcon}
            </button>
          )}
          <Tooltip
            id="my-tooltip-1"
            place="right"
            content={showPassword ? "Hide password" : "Show password"}
          />
        </label>
        {error && (
          <div className={styles.errorText}>
            {errorIcon} {errorText}
          </div>
        )}
      </div>
    );
  }
);

export default SignInInput;
