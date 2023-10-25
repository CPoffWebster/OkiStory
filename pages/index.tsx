import { GetServerSideProps } from "next";
import { settingsIcon } from "@/data/icons";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./homepage.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/identifier",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`${styles.settings} ${["clickable-container-small"]}`}>
          {settingsIcon}
        </span>
        <h1 className={styles.title}>Oki Story</h1>
        <div></div> {/* Empty div for layout balance */}
      </div>

      <div className={styles["main-content"]}>
        {/* Left Section */}
        <div className={styles.section}>
          <div className={styles.sectionImage}>
            <Image
              src="/book_pile.png"
              layout="fill"
              objectFit="contain"
              priority={true}
              alt={"Bookshelf"}
            ></Image>
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
            <Image
              src="/happy_book.png"
              layout="fill"
              objectFit="contain"
              priority={true}
              alt={"Create"}
            ></Image>
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
