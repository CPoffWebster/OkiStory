import { signIn, signOut, useSession } from "next-auth/react";
import { settingsIcon } from "@/data/icons";
import Image from "next/image";
import Link from "next/link";
import styles from "./homepage.module.css";
import { Button } from "@/app/Button";
import "../styles/globals.css";

export default function HomePage() {
  const session = useSession();
  const isLoggedIn = !!session.data;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`${styles.settings} ${["clickable-container-small"]}`}>
          {settingsIcon}
        </span>
        <h1 className={styles.title}>Oki Story</h1>
        <ul className="flex gap-4">
          {isLoggedIn && (
            <>
              {/* <div className="flex items-center">
                Credits remaining {credits.data}
              </div>
              <li>
                <Button
                onClick={() => {
                  buyCredits().catch(console.error);
                }}
                >
                  Buy Credits
                </Button>
              </li> */}
              <li>
                <Button
                  variant="secondary"
                  onClick={() => {
                    signOut().catch(console.error);
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <Button
                onClick={() => {
                  signIn().catch(console.error);
                }}
              >
                Login
              </Button>
            </li>
          )}
        </ul>
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
