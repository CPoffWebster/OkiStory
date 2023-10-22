import { GetServerSideProps } from "next";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import {
  Characters,
  CharactersAttributes,
} from "@/services/database/models/Characters";
import { Selections } from "@/app/components/Selections/Selections";
import styles from "./story.module.css";
import axios from "axios";
import { getSession } from "next-auth/react";
import { connectToDb } from "@/services/database/database";

export interface StoryElement extends CharactersAttributes {}

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
  const userEmail = session.user!.email;

  connectToDb();
  let heroes = await Characters.getDefaultCharacters();
  return {
    props: { userEmail, heroes },
  };
};

export default function Story(props: {
  userEmail: string;
  heroes: StoryElement[];
}) {
  const router = useRouter();
  const selectionType = "Hero";

  const handleBack = (): void => {
    router.push("/create/theme");
    return;
  };

  const handleSelectElement = async (): Promise<void> => {
    const response = await axios.post("/api/generation/story", {
      locationGUID: sessionStorage.getItem("Theme"),
      characterGUID: sessionStorage.getItem("Hero"),
      themeGUID: 0,
      userEmail: props.userEmail,
    });
    sessionStorage.clear();
    router.push(`/read/${response.data.bookGuid}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          onClick={handleBack}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        <h2 className={styles.title}>
          Choose your <u className={styles.titleFiller}>{selectionType}</u>!{" "}
        </h2>
        <div></div>
      </div>
      <Selections
        elementType={selectionType}
        elements={props.heroes}
        onSelectElement={handleSelectElement}
      ></Selections>
    </div>
  );
}
