import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import { Selections } from "@/app/components/Selections/Selections";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./story.module.css";
import { HomeIcon } from "@/app/components/Icons/HomeIcon";
import Button from "@/app/components/Button/Button";

export interface StoryElement extends CharactersAttributes {}

export default function Story() {
  const router = useRouter();
  const selectionType = "Location";
  const [locations, setLocations] = useState<StoryElement[] | null>(null);

  // Get locations from database
  const getLocations = async () => {
    const locationsList = await axios.post("/api/create/getLocations");
    setLocations(locationsList.data.locations);
  };

  // Initial load of locations
  useEffect(() => {
    getLocations();
  }, []);

  const handleSubmit = (): void => {
    if (sessionStorage.getItem("Route")) {
      router.push("/create/verify");
    } else {
      router.push("/create/character");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Choose your <u className={styles.titleFiller}>{selectionType}</u>!{" "}
        </h2>
        <div></div>
      </div>
      {locations && (
        <Selections
          elementType={selectionType}
          elements={locations}
          onSelectElement={() => handleSubmit()}
        ></Selections>
      )}
      <div
        style={{
          marginTop: "2vw",
        }}
      >
        <Button
          text="Home"
          className={`${["clickable-container-small"]}`}
          markedAsImportant={false}
          icon={<HomeIcon />}
          onClick={() => router.push("/")}
        ></Button>
      </div>
    </div>
  );
}
