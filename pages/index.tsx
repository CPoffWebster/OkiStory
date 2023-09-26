import { GetServerSideProps } from "next";
import { settingsIcon } from "@/data/icons";
import Link from "next/link";
import styles from "./homepage.module.css";

import { getSession } from "next-auth/react";

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
        <button>{settingsIcon}</button>
        <h1>Oki Story</h1>
        <div></div> {/* Empty div for layout balance */}
      </div>

      <div className={styles["main-content"]}>
        {/* Left Section */}
        <div className={styles.section}>
          <img src="/changeImage.jpg" alt="Books" />
          <Link href="/bookshelf/books">
            <button className={styles.button}>Book Shelf</button>
          </Link>
        </div>

        {/* Right Section */}
        <div className={styles.section}>
          <img src="/changeImage.jpg" alt="Open Book" />
          <Link href="/create/story">
            <button className={styles.button}>New Story</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
