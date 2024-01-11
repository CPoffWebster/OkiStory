import { useState } from "react";
import styles from "./EmojiRating.module.css";
import axios from "axios";

interface EmojiRatingProps {
  previousRating: number;
  bookGuid: string;
}

const EmojiRating: React.FC<EmojiRatingProps> = ({
  previousRating,
  bookGuid,
}) => {
  const emojis = ["😠", "😦", "😐", "🙂", "😀"];
  const [selectedRating, setSelectedRating] = useState<number>(
    previousRating || 0
  );

  const updateRatingSelection = async (rating: number) => {
    setSelectedRating(rating);
    await axios.post("/api/read/rateBook", {
      bookGuid,
      rating,
    });
    console.log("Rating updated");
  };

  return (
    <ul className={styles.emojiRating}>
      {emojis.map((emoji, index) => {
        const rating = index + 1;
        return (
          <li
            key={rating}
            onClick={() => updateRatingSelection(rating)}
            style={{ opacity: selectedRating === rating ? 1 : 0.5 }}
          >
            {emoji}
          </li>
        );
      })}
    </ul>
  );
};

export default EmojiRating;
