import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./LoginButton.module.css";
import { useState } from "react";

const LoginButton: React.FC = () => {
  const session = useSession();
  const isLoggedIn = !!session.data;

  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const toggleSessionDetails = () => {
    setShowSessionDetails(!showSessionDetails);
  };

  return (
    <>
      {isLoggedIn && (
        <div onClick={toggleSessionDetails} className={styles.loggedInButton}>
          {session.data?.user.email?.charAt(0).toUpperCase()}
        </div>
      )}
      {showSessionDetails && (
        <div className={styles.signOutOptions}>
          <div className={styles.signOutDetails}>
            {session.data?.user.name}
            <br />
            <strong>{session.data?.user.email}</strong>
          </div>
          <div className={styles.signOutSeparator}></div>
          <button
            onClick={() => {
              signOut().catch(console.error);
            }}
            className={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>
      )}
      {!isLoggedIn && (
        <button
          className={`${styles.loginButton} containerBoxSmall`}
          onClick={() => {
            signIn("google").catch(console.error);
          }}
        >
          Login
        </button>
        // <Button
        //   onClick={() => {
        //     signIn("google").catch(console.error);
        //   }}
        // >
        //   Login
        // </Button>
      )}
    </>
  );
};

export default LoginButton;
