import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import styles from "./identifier.module.css";
import LoginLayout from "@/app/components/LoginLayout/LoginLayout";
import React, { useEffect, useRef } from "react";
import { getSessionStorage, setSessionStorage } from "@/services/session";
import { useRouter } from "next/router";
import axios from "axios";
import SignInInput from "@/app/components/SignInInput/SignInInput";
import { OrSeperator } from "@/app/components/OrSeperator/OrSeperator";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const emailValue = getSessionStorage("email");
    setEmailValue(emailValue);
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
      if (exists.data) router.push("/auth/password");
      else router.push("/auth/register");
      return;
    }
    setEmailError(!isEmailValid); // Set the error state based on email validity
  };

  return (
    <LoginLayout>
      <h1 className={styles.title}>Reading Alpha</h1>
      <SignInInput
        ref={inputRef}
        value={emailValue}
        error={emailError}
        label="Email"
        type="email"
        errorText="Invalid email"
        onChange={handleChange}
      />
      <button className={styles.continueButton} onClick={handleSubmit}>
        Continue
      </button>
      <div className={styles.signup}>
        Don&apos;t have an account? <a href="/signup">Sign up</a>
      </div>
      <OrSeperator />
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
