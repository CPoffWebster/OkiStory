import { useEffect, useState } from "react";
import styles from "./EmojiRating.module.css";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Modal from "../LoginButton/BuyCreditsModal";
import LoginButton from "../LoginButton/LoginButton";
import Button from "../Button/Button";

const emojis = ["😠", "😦", "😐", "🙂", "😀"];

const getColorForEmoji = (index: number): string => {
  const ratio = index / (emojis.length - 1);
  let red, green, blue;

  if (ratio < 0.5) {
    // From red to yellow (red stays at 255, green increases)
    red = 255;
    green = Math.round(2 * ratio * 255);
    blue = 0;
  } else {
    // From yellow to green (green stays at 255, red decreases)
    red = Math.round(255 * (1 - 2 * (ratio - 0.5)));
    green = 255;
    blue = 0;
  }

  return `rgb(${red}, ${green}, ${blue})`;
};

interface EmojiRatingProps {
  previousRating: number;
  bookGuid: string;
}

const EmojiRating: React.FC<EmojiRatingProps> = ({
  previousRating,
  bookGuid,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(
    previousRating || 0
  );

  useEffect(() => {
    setSelectedRating(previousRating);
  }, [previousRating]);

  const session = useSession(); // session here is an object with 'data' and 'status' properties
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  const updateRatingSelection = async (rating: number) => {
    if (!!session.data === false) {
      setShowModal(!showModal);
      return;
    }
    setSelectedRating(rating);
    await axios.post("/api/read/rateBook", {
      bookGuid,
      rating,
    });
  };

  return (
    <>
      <ul className={styles.emojiRating}>
        {emojis.map((emoji, index) => {
          const rating = index + 1;
          const color = getColorForEmoji(index);
          return (
            <li
              key={rating}
              onClick={() => updateRatingSelection(rating)}
              style={{
                opacity: selectedRating === rating ? 1 : 0.5,
                color: color,
                borderColor: color,
              }}
            >
              {emoji}
            </li>
          );
        })}
      </ul>
      {showModal && (
        <Modal onClose={toggleModal}>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 30,
              color: "#333",
              textAlign: "center",
            }}
          >
            <p>You must be logged in to rate stories!</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                text="Login"
                size="small"
                className="containerBoxSmall"
                markedAsImportant={true}
                onClick={() => {
                  signIn("google").catch(console.error);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EmojiRating;
