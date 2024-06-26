import React, { useEffect } from "react";
import LoginLayout from "@/app/components/LoginLayout/LoginLayout";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./password.module.css";
import { getSessionStorage, setSessionStorage } from "@/services/session";
import SignInInput from "@/app/components/SignInInput/SignInInput";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Password() {
  const router = useRouter();
  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);

  useEffect(() => {
    const emailValue = getSessionStorage("email");
    if (emailValue === "") {
      router.push("/");
      return;
    }
    setEmailValue(emailValue);
  }, []);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPasswordValue(e.target.value);
  };

  const handleEdit = () => {
    setSessionStorage("email", emailValue);
    router.push("/auth/identifier");
    return;
  };

  // handle password submit
  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/users/verifyUser", {
        email: emailValue,
        password: passwordValue,
      });
      if (data === false) {
        setPasswordError(true);
      } else {
        signIn("credentials", {
          email: emailValue,
          password: passwordValue,
          callbackUrl: "/",
        });
      }
    } catch (err) {
      setPasswordError(true);
    }
  };

  return (
    <LoginLayout>
      <h1 className={styles.title}>Welcome Back!</h1>
      <div className={styles["input-edit-container"]}>
        <input
          className={`mdc-text-field--outlined ${styles["email-input-edit"]}`}
          value={emailValue}
          readOnly
        />
        <button className={styles["edit-button"]} onClick={handleEdit}>
          Edit
        </button>
      </div>
      <SignInInput
        value={passwordValue}
        error={passwordError}
        label="Password"
        type="password"
        errorText="Invalid password"
        onChange={handleChange}
        handleSubmit={handleSubmit}
        showPasswordToggle={true}
      />
      <button className={styles.signInButton} onClick={handleSubmit}>
        Continue
      </button>
      <div>
        <Link
          onClick={() => setSessionStorage("email", emailValue)}
          href="/auth/reset-password"
        >
          Forgot password?
        </Link>
      </div>
    </LoginLayout>
  );
}
