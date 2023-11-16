import Link from "next/link";
import LoginButton from "@/app/components/LoginButton/LoginButton";
import styles from "./homepage.module.css";
import "../styles/globals.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Oki Story</h1>
        {<LoginButton />}
      </div>

      <div className={styles["main-content"]}>
        {/* Left Section */}
        <div className={styles.section}>
          <div className={styles.sectionImage}>
            <img src="/book_pile.png" alt={"Bookshelf"}></img>
          </div>
          <Link href="/bookshelf/books">
            <button
              className={`${styles.button} ${styles["button-left"]} containerBoxLarge`}
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
          <Link href="/create/location">
            <button
              className={`${styles.button} ${styles["button-right"]} containerBoxLarge`}
            >
              New Story
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
