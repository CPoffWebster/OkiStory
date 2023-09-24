import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import styles from "./identifier.module.css";
import LoginLayout from "@/app/components/LoginLayout/LoginLayout";
import React, { useEffect } from "react";
import { errorIcon } from "@/data/icons";
import { getSessionStorage, setSessionStorage } from "@/services/session";
import { useRouter } from "next/router";
import axios from "axios";
var validator = require("validator");

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}

export default function Identifier(props: {
  providers: Record<string, { id: string; name: string }>;
  csrfToken: string;
}) {
  const router = useRouter();
  const [emailValue, setEmailValue] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  useEffect(() => {
    const emailValue = getSessionStorage("email");
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
      setSessionStorage("email", emailValue);
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
      {props.providers &&
        Object.values(props.providers).map((provider) => {
          if (provider.id !== "credentials") {
            return (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className={styles.socialButton}
              >
                Sign in with {provider.name}
              </button>
            );
          }
        })}
      <div className={styles.signup}>New here? Sign up</div>
    </LoginLayout>
  );
}
