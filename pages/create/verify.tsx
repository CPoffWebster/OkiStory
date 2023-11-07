import { useRouter } from "next/router";
import {
  Characters,
  CharactersAttributes,
} from "@/services/database/models/Characters";
import styles from "./verify.module.css";
import axios from "axios";
import { Selection } from "@/app/components/Selections/Selection";
import { GetServerSidePropsContext } from "next";
import { connectToDb } from "@/services/database/database";
import {
  Locations,
  LocationsAttributes,
} from "@/services/database/models/Locations";
import { useEffect, useState } from "react";

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   //   connectToDb();
//   //   let location = await Locations.getLocation(
//   //     getSessionStorage("Location") || ""
//   //   );
//   //   let character = await Characters.getCharacter(
//   //     getSessionStorage("Character") || ""
//   //   );
//   const location = getSessionStorage("Location");
//   const character = getSessionStorage("Character");
//   return {
//     props: { location, character },
//   };
// }

export default function Story() {
  const router = useRouter();
  const [character, setCharacter] = useState<CharactersAttributes | null>(null);
  const [location, setLocation] = useState<LocationsAttributes | null>(null);

  const getCharacter = async () => {
    const character = await axios.post("/api/create/getCharacter", {
      guid: sessionStorage.getItem("Character"),
    });
    setCharacter(character.data.character);
  };
  const getLocation = async () => {
    const location = await axios.post("/api/create/getLocation", {
      guid: sessionStorage.getItem("Location"),
    });
    setLocation(location.data.location);
  };

  // Initial load of characters
  useEffect(() => {
    getCharacter();
    getLocation();
  }, []);

  const handleSubmit = async (): Promise<void> => {
    const response = await axios.post("/api/generation/story", {
      locationGUID: character!.GUID,
      characterGUID: location!.GUID,
      themeGUID: 0,
    });
    sessionStorage.clear();
    router.push(`/read/${response.data.bookGuid}`);
  };

  const handleLocation = () => {
    sessionStorage.setItem("Route", "verify");
    router.push("/create/location");
  };
  const handleCharacter = () => {
    sessionStorage.setItem("Route", "verify");
    router.push("/create/character");
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span className={styles.titleFiller}>Great choices!</span> If you
          would like to change your selections click the image below:
        </h1>
        <div></div>
      </div>
      <div className={styles["selection-container"]}>
        {location != null && (
          <div>
            <span className={styles["section-name"]}>Location</span>
            <Selection
              elementType="Location"
              element={location}
              onSelectElement={handleLocation}
            />
          </div>
        )}
        {character != null && (
          <div>
            <span className={styles["section-name"]}>Character</span>
            <Selection
              elementType="Character"
              element={character}
              onSelectElement={handleCharacter}
            />
          </div>
        )}
      </div>
      <button
        className={`${styles.button} ${["clickable-container-large"]}`}
        onClick={handleSubmit}
      >
        Start Reading!
      </button>
    </div>
  );
}
