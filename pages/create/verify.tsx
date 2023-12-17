import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import { Selection } from "@/app/components/Selections/Selection";
import { LocationsAttributes } from "@/services/database/models/Locations";
import { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import styles from "./verify.module.css";
import axios from "axios";
import { HomeIcon } from "@/app/components/Icons/HomeIcon";

export default function Story() {
  const router = useRouter();
  const [disableGeneration, setDisableGeneration] = useState<boolean>(true);
  const [character, setCharacter] = useState<CharactersAttributes | null>(null);
  const [location, setLocation] = useState<LocationsAttributes | null>(null);
  const [amountOfGenerations, setAmountOfGenerations] = useState<number>(0);

  // Initial load of characters
  useEffect(() => {
    getAmountOfGenerations(); // Fetch the latest session data
    allowGeneration();
    getCreationElements();
  }, []);

  const getAmountOfGenerations = async () => {
    const paidAccount = await axios.post("/api/users/getAvailableGenerations");
    if (paidAccount.data.paidAccount === null) return;
    setAmountOfGenerations(paidAccount.data.paidAccount.AmountOfGenerations);
  };

  const allowGeneration = async () => {
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
  };

  const getCreationElements = async () => {
    const response = await axios.post("/api/read/getCreationElements", {
      locationGUID: sessionStorage.getItem("Location"),
      characterGUID: sessionStorage.getItem("Character"),
    });
    if (response.data.location === null || response.data.character === null) {
      alert("Error fetching location and character, please try again.");
      router.push("/");
      return;
    }
    setLocation(response.data.location);
    setCharacter(response.data.character);
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
            sessionStorage.clear();
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
