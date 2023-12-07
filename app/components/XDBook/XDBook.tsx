import React, { useState } from "react";
import { BooksAttributes } from "@/services/database/models/Books";
import styles from "./XDBook.module.css";

type XDBookProps = {
  book: BooksAttributes;
};

const XDBook: React.FC<XDBookProps> = ({ book }) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleMouseEnter = () => setIsRotated(true);
  const handleMouseLeave = () => setIsRotated(false);

  return (
    <div className={styles.wrap}>
      <div className={styles.perspective}>
        <div className={`${styles.bookWrap} ${isRotated ? styles.rotate : ""}`}>
          <div
            className={`${styles.book} ${styles.bookStyle}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h1 className={styles.title}>{book.Title}</h1>
            <div className={styles.image}>
              <img
                src={`/api/images/getImage?filename=${book.imageGCSLocation}&imageType=book`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XDBook;
