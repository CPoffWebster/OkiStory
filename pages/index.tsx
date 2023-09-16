import { GetServerSideProps } from "next";
import { checkCookies } from "../services/cookies";
import { settingsIcon } from "@/data/icons";
import Link from "next/link";
import Image from "next/image";
import styles from "./homepage.module.css";
// import "./homepage.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await checkCookies(context.req);
  if (!user) {
    return {
      redirect: {
        destination: `/login/identifier`,
        permanent: false,
      },
    };
  }

  return {
    props: { user: user },
  };
};

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button>{settingsIcon}</button>
        <h1>Reading Alpha</h1>
        <div></div> {/* Empty div for layout balance */}
      </div>

      <div className={styles["main-content"]}>
        {/* Left Section */}
        <div className={styles.section}>
          <Image src="/changeImage.jpg" alt="Books" width={500} height={300} />
          <Link href="/bookshelf/books">
            <button className={styles.button}>Book Shelf</button>
          </Link>
        </div>

        {/* Right Section */}
        <div className={styles.section}>
          <Image
            src="/changeImage.jpg"
            alt="Open Book"
            width={500}
            height={300}
          />
          <Link href="/create/story">
            <button className={styles.button}>New Story</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
