import React, { useEffect, forwardRef } from "react";
import styles from "./SignInInput.module.css";
import { MDCTextField } from "@material/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import { errorIcon, eyeOnIcon, eyeOffIcon } from "@/data/icons";

interface SignInInputProps {
  value: string;
  error: boolean;
  label: string;
  type: string;
  errorText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignInInput = forwardRef<HTMLInputElement, SignInInputProps>(
  (props, ref) => {
    const { value, error, label, type, errorText, onChange } = props;

    const labelRef = React.useRef<HTMLLabelElement>(null);

    useEffect(() => {
      if (labelRef.current) {
        new MDCTextField(labelRef.current);
      }
    }, []);

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
            type={type}
            className={`mdc-text-field__input ${
              error ? "mdc-text-field--invalid" : ""
            }`}
            aria-labelledby={`${label}-id`}
            value={value}
            onChange={onChange}
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
