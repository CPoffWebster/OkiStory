import LoginButton from "@/app/components/LoginButton/LoginButton";
import styles from "./homepage.module.css";
import Button from "@/app/components/Button/Button";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import "../styles/globals.css"; // ToDo
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const session = useSession(); // session here is an object with 'data' and 'status' properties
  const [amountOfGenerations, setAmountOfGenerations] = useState<number>(0);

  useEffect(() => {
    // Fetch the latest session data
    getAmountOfGenerations();
  }, []);

  const getAmountOfGenerations = async () => {
    const paidAccount = await axios.post("/api/users/getAvailableGenerations");
    setAmountOfGenerations(paidAccount.data.paidAccount.AmountOfGenerations);
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Oki Story</h1>
        <LoginButton
          session={session}
          amountOfGenerations={amountOfGenerations}
        />
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
          {(session === null || session.data === null) && (
            <Button
              text="Create Story"
              size="large"
              markedAsImportant={true}
              className="containerBoxLarge"
              disabled={session === null || session.data === null}
              disabledMessage="You must be logged in to create a story."
              onClick={() => {
                router.push("/create/location");
              }}
            ></Button>
          )}
          {session !== null && session.data !== null && (
            <Button
              text="Create Story"
              size="large"
              markedAsImportant={true}
              className="containerBoxLarge"
              disabled={amountOfGenerations === 0}
              disabledMessage="Please contact us to add more book credits to your account."
              onClick={() => {
                router.push("/create/location");
              }}
            ></Button>
          )}
        </div>
      </div>
    </div>
  );
}
