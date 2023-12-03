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
  const [disableGeneration, setDisableGeneration] = useState<boolean>(true);
  const [character, setCharacter] = useState<CharactersAttributes | null>(null);
  const [location, setLocation] = useState<LocationsAttributes | null>(null);
  const [amountOfGenerations, setAmountOfGenerations] = useState<number>(0);

  useEffect(() => {
    // Fetch the latest session data
    getAmountOfGenerations();
  }, []);

  const getAmountOfGenerations = async () => {
    const paidAccount = await axios.post("/api/users/getAvailableGenerations");
    if (paidAccount.data.paidAccount === null) return;
    setAmountOfGenerations(paidAccount.data.paidAccount.AmountOfGenerations);
  };

  // Initial load of characters
  useEffect(() => {
    allowGeneration();
    getCharacter();
    getLocation();
  }, []);

  const allowGeneration = async () => {
    try {
      const response = await axios.get("/api/generation/allowGeneration");
      if (response.data.mostRecentBook) {
        const currentTime = new Date().getTime();
        const creationTime = new Date(
          response.data.mostRecentBook.createdAt
        ).getTime();
        const timeDiff = (currentTime - creationTime) / 1000; // Difference in seconds

        if (timeDiff < 90) {
          // Book was created within the last 90 seconds
          setDisableGeneration(true);
          // Set a timer to re-check after the remaining time until 90 seconds are completed
          setTimeout(allowGeneration, (90 - timeDiff) * 1000);
        } else setDisableGeneration(false);
      } else setDisableGeneration(false);
    } catch (error) {
      console.error("Error checking generation allowance", error);
    }
  };

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
    await allowGeneration();

    if (disableGeneration) {
      alert("Please wait before generating a new story.");
      return;
    }

    const response = await axios.post("/api/generation/story", {
      locationGUID: location!.GUID,
      characterGUID: character!.GUID,
      themeGUID: 0,
    });
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
        {disableGeneration ? (
          <Button
            text="Create Story!"
            size="medium"
            markedAsImportant={true}
            className="containerBoxSmall"
            disabled={disableGeneration}
            disabledMessage="Please wait before generating a new story."
            onClick={handleSubmit}
          ></Button>
        ) : (
          <Button
            text="Create Story!"
            size="medium"
            markedAsImportant={true}
            className="containerBoxSmall"
            disabled={amountOfGenerations === 0}
            disabledMessage="Please contact us to add more book credits to your account."
            onClick={handleSubmit}
          ></Button>
        )}
      </div>
    </div>
  );
}
