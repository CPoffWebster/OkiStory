import React, { useState } from "react";
import { arrowLeftIcon, arrowRightIcon, homeIcon } from "@/data/icons";
import styles from "./NavButtons.module.css";

export function useFlippedPages() {
  const [flippedPages, setFlippedPages] = useState<Set<number>>(new Set());

  const flipPage = (index: number, isFlippingRight: boolean) => {
    setFlippedPages((prev) => {
      const newSet = new Set(prev);
      if (isFlippingRight) {
        newSet.add(index);
        newSet.add(index + 1);
      } else {
        newSet.delete(index - 1);
        newSet.delete(index - 2);
      }
      return newSet;
    });
  };

  return { flippedPages, flipPage };
}

type NavigationButtonsProps = {
  disableLeftArrow: boolean;
  disableRightArrow: boolean;
  loadingRightArrow: boolean;
  onFlipLeft: () => void;
  onFlipRight: () => void;
  onReturnHome: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  disableLeftArrow,
  disableRightArrow,
  loadingRightArrow,
  onFlipLeft,
  onFlipRight,
  onReturnHome,
}) => (
  <div className={styles.navButtons}>
    <span
      className={`${["clickable-container-small"]} ${
        disableLeftArrow ? styles.disabled : ""
      }`}
      onClick={onFlipLeft}
    >
      {arrowLeftIcon}
    </span>
    <span
      className={`${styles.buttonHome} ${["clickable-container-small"]}`}
      onClick={onReturnHome}
    >
      <span>Home</span> {homeIcon}
    </span>
    <span
      className={`${["clickable-container-small"]} ${
        disableRightArrow ? styles.disabled : ""
      } ${loadingRightArrow ? styles.loading : ""}`}
      onClick={onFlipRight}
    >
      {arrowRightIcon}
    </span>
  </div>
);

export default NavigationButtons;
