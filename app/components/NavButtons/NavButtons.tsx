import React, { useState } from "react";
import styles from "./NavButtons.module.css";
import Button from "../Button/Button";
import { HomeIcon } from "../Icons/HomeIcon";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";

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
  isLoadingRightArrow: boolean;
  rightArrowMessage?: string;
  leftImportant?: boolean;
  rightImportant?: boolean;
  homeImportant?: boolean;
  onFlipLeft: () => Promise<void> | void;
  onFlipRight: () => Promise<void> | void;
  onReturnHome: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  disableLeftArrow,
  disableRightArrow,
  isLoadingRightArrow,
  leftImportant = false,
  rightImportant = false,
  homeImportant = false,
  onFlipLeft,
  onFlipRight,
  onReturnHome,
}) => (
  <div className={styles.navButtons}>
    <Button
      className="containerBoxSmall"
      markedAsImportant={leftImportant}
      icon={<ArrowLeftIcon />}
      onClick={onFlipLeft}
      disabled={disableLeftArrow}
    ></Button>
    <Button
      text="Home"
      className="containerBoxSmall"
      markedAsImportant={homeImportant}
      icon={<HomeIcon />}
      onClick={onReturnHome}
    ></Button>
    <Button
      className="containerBoxSmall"
      markedAsImportant={rightImportant}
      icon={<ArrowRightIcon />}
      onClick={onFlipRight}
      disabled={disableRightArrow}
      isLoadingRightArrow={isLoadingRightArrow}
    ></Button>
  </div>
);

export default NavigationButtons;
