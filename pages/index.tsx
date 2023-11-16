import Link from "next/link";
import LoginButton from "@/app/components/LoginButton/LoginButton";
import styles from "./homepage.module.css";
import "../styles/globals.css";
import Button from "@/app/components/Button/Button";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Oki Story</h1>
        {<LoginButton />}
      </div>
      <div className={styles.actionSelections}>
        {/* Left Section */}
        <div className={styles.section}>
          <div className={styles.sectionImage}>
            <img src="/book_pile.png" alt={"Bookshelf"}></img>
          </div>
          <Button
            text="Book Shelf"
            size="large"
            className="containerBoxLarge"
            onClick={() => {
              router.push("/bookshelf/books");
            }}
          ></Button>
        </div>

        {/* Right Section */}
        <div className={styles.section}>
          <div className={styles.sectionImage}>
            <img src="/happy_book.png" alt={"Create"}></img>
          </div>
          <Button
            text="Create Story"
            size="large"
            markedAsImportant={true}
            className="containerBoxLarge"
            onClick={() => {
              router.push("/create/location");
            }}
          ></Button>
        </div>
      </div>
    </div>
  );
}
