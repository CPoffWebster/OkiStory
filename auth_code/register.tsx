import React, { useEffect } from "react";
import LoginLayout from "@/app/components/LoginLayout/LoginLayout";
import { useRouter } from "next/router";
import styles from "./register.module.css";
import { getSessionStorage, setSessionStorage } from "@/services/session";
import SignInInput from "@/app/components/SignInInput/SignInInput";

export default function Register() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
    if (passwordError && e.target.value.length >= 8) {
      setPasswordError(false);
    }
  };

  const handleEdit = () => {
    setSessionStorage("email", emailValue);
    router.push("/auth/identifier");
  };

  const handleSubmit = () => {
    if (passwordValue.length < 8) {
      setPasswordError(true);
    } else {
      alert("Registering new users disabled currently");
      // const { data } = await axiosInstance("/api/users/registerUser", {
      //   email: emailValue,
      //   password: passwordValue,
      // });
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
      <SignInInput
        value={passwordValue}
        error={passwordError}
        label="Password"
        type="password"
        errorText="Password must be at least 8 characters"
        onChange={handleChange}
        handleSubmit={handleSubmit}
        showPasswordToggle={true}
      />
      <button className={styles.signInButton} onClick={handleSubmit}>
        Continue
      </button>
    </LoginLayout>
  );
}
