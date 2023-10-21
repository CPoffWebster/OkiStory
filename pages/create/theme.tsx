import { GetServerSideProps } from "next";
import { getAllDefaultLocations } from "@/services/storyElements";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import styles from "./story.module.css";
import { Selections } from "@/app/components/Selections/Selections";

export interface StoryElement extends CharactersAttributes {}

export const getServerSideProps: GetServerSideProps = async () => {
  const themes = await getAllDefaultLocations();
  return {
    props: { themes },
  };
};

export default function Story(props: { themes: StoryElement[] }) {
  const router = useRouter();
  const selectionType = "Theme";

  const handleBack = (): void => {
    router.push("/");
    return;
  };

  const handleSelectElement = (): void => {
    router.push("/create/hero");
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
        elements={props.themes}
        onSelectElement={handleSelectElement}
      ></Selections>
    </div>
  );
}
