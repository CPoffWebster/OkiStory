import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./LoginButton.module.css";
import { useState } from "react";
import Button from "../Button/Button";

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
        <div className={styles.loggedInContainer}>
          <div onClick={toggleSessionDetails} className={styles.loggedInButton}>
            {session.data?.user.email?.charAt(0).toUpperCase()}
          </div>
          <Button
            text="Buy Credits"
            size="xsmall"
            className="containerBoxSmall"
            markedAsImportant={false}
            onClick={function (): void {}}
          ></Button>
          <p
            style={{
              fontSize: "1vw",
            }}
          >
            {session.data?.user.paidAccount.AmountOfGenerations || 0} credits
            left
          </p>
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
        <Button
          text="Login"
          size="small"
          className={`${styles.loginButton} containerBoxSmall`}
          markedAsImportant={true}
          onClick={() => {
            signIn("google").catch(console.error);
          }}
        ></Button>
      )}
    </>
  );
};

export default LoginButton;
