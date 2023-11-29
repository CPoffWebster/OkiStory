import { SessionContextValue, signIn, signOut } from "next-auth/react";
import styles from "./LoginButton.module.css";
import { useState } from "react";
import Button from "../Button/Button";

type LoginButtonProps = {
  session: SessionContextValue;
  amountOfGenerations: number;
};

const LoginButton: React.FC<LoginButtonProps> = ({
  session,
  amountOfGenerations,
}) => {
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
          {/* <Button
            text="Buy Credits"
            size="xsmall"
            className="containerBoxSmall"
            markedAsImportant={false}
            onClick={function (): void {}}
          ></Button> */}
          <p
            style={{
              fontSize: "1vw",
            }}
          >
            {amountOfGenerations || 0} book credits left
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
        <div className={styles.loginButton}>
          <Button
            text="Login"
            size="small"
            className="containerBoxSmall"
            markedAsImportant={true}
            onClick={() => {
              signIn("google").catch(console.error);
            }}
          ></Button>
        </div>
      )}
    </>
  );
};

export default LoginButton;
