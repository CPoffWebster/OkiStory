import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./homepage.module.css";
import { Button } from "@/app/Button";
import "../styles/globals.css";
import { useState } from "react";

export default function HomePage() {
  const session = useSession();
  const isLoggedIn = !!session.data;

  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const toggleSessionDetails = () => {
    setShowSessionDetails(!showSessionDetails);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Oki Story</h1>
        <span>
          {isLoggedIn && (
            <div
              onClick={toggleSessionDetails}
              className={styles.loggedInButton}
            >
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
            <Button
              onClick={() => {
                signIn("google").catch(console.error);
              }}
            >
              Login
            </Button>
          )}
        </span>
      </div>

      <div className={styles["main-content"]}>
        {/* Left Section */}
        <div className={styles.section}>
          <div className={styles.sectionImage}>
            <img src="/book_pile.png" alt={"Bookshelf"}></img>
          </div>
          <Link href="/bookshelf/books">
            <button
              className={`${styles.button} ${styles["button-left"]} ${[
                "clickable-container-large",
              ]}`}
            >
              Book Shelf
            </button>
          </Link>
        </div>

        {/* Right Section */}
        <div className={styles.section}>
          <div className={styles.sectionImage}>
            <img src="/happy_book.png" alt={"Create"}></img>
          </div>
          <Link href="/create/theme">
            <button
              className={`${styles.button} ${styles["button-right"]} ${[
                "clickable-container-large",
              ]}`}
            >
              New Story
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
