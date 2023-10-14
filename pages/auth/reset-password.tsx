import { GetServerSidePropsContext } from "next";
import LoginLayout from "@/app/components/LoginLayout/LoginLayout";
import React, { useEffect, useRef } from "react";
import { getSessionStorage, setSessionStorage } from "@/services/session";
import { useRouter } from "next/router";
import SignInInput from "@/app/components/SignInInput/SignInInput";
import axios from "axios";
var validator = require("validator");
import styles from "./reset-password.module.css";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const error = (context.query.error as string) || null;
  return {
    props: { error },
  };
}

export default function ResetPassword() {
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
    alert("todo");
    // const isEmailValid = validator.isEmail(emailValue);
    // if (isEmailValid) {
    //   const exists = await axios.post("/api/users/verifyUser", {
    //     email: emailValue,
    //   });
    //   setSessionStorage("email", emailValue);
    //   if (exists.data) router.push("/auth/password");
    //   else router.push("/auth/register");
    //   return;
    // }
    // setEmailError(!isEmailValid); // Set the error state based on email validity
  };

  return (
    <LoginLayout>
      <h1 className={styles.title}>Reset your password</h1>
      {/* <div className={styles.error}> */}
      <p style={{ textAlign: "center" }}>
        Enter your email address and we will send you<br></br>
        instructions to reset your password.<br></br>
        <br></br>
      </p>
      {/* </div> */}
      <SignInInput
        ref={inputRef}
        value={emailValue}
        error={emailError}
        label="Email"
        type="email"
        errorText="Invalid email"
        onChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <button className={styles.continueButton} onClick={handleSubmit}>
        Continue
      </button>
      <div>
        <a
          onClick={() => setSessionStorage("email", emailValue)}
          href="/auth/identifier"
        >
          Back to Login
        </a>
      </div>
    </LoginLayout>
  );
}
