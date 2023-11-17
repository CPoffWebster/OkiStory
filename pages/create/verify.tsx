import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import { Selection } from "@/app/components/Selections/Selection";
import { LocationsAttributes } from "@/services/database/models/Locations";
import { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import styles from "./verify.module.css";
import axios from "axios";
import { HomeIcon } from "@/app/components/Icons/HomeIcon";
import { useSession } from "next-auth/react";

export default function Story() {
  const router = useRouter();
  const session = useSession();
  const [character, setCharacter] = useState<CharactersAttributes | null>(null);
  const [location, setLocation] = useState<LocationsAttributes | null>(null);

  // Initial load of characters
  useEffect(() => {
    getCharacter();
    getLocation();
  }, []);

  const getCharacter = async () => {
    const character = await axios.post("/api/create/getCharacter", {
      guid: sessionStorage.getItem("Character"),
    });
    if (character.data.character === null) {
      alert("Error fetching character, please try again.");
      router.push("/");
      return;
    }
    setCharacter(character.data.character);
  };
  const getLocation = async () => {
    const location = await axios.post("/api/create/getLocation", {
      guid: sessionStorage.getItem("Location"),
    });
    if (location.data.location === null) {
      alert("Error fetching location, please try again.");
      router.push("/");
      return;
    }
    setLocation(location.data.location);
  };

  const handleSubmit = async (): Promise<void> => {
    const response = await axios.post("/api/generation/story", {
      locationGUID: location!.GUID,
      characterGUID: character!.GUID,
      themeGUID: 0,
    });
    // sessionStorage.clear();
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
      <div className={styles.buttonContainer}>
        <Button
          text="Home"
          size="medium"
          className="containerBoxSmall"
          markedAsImportant={false}
          icon={<HomeIcon />}
          onClick={() => {
            router.push("/");
          }}
        ></Button>
        <Button
          text="Create Story!"
          size="medium"
          markedAsImportant={true}
          className="containerBoxSmall"
          disabled={session.data?.user.paidAccount.AmountOfGenerations === 0}
          disabledMessage="Please contact us to add more book credits to your account."
          onClick={handleSubmit}
        ></Button>
      </div>
    </div>
  );
}
