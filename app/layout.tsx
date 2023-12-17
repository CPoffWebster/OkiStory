"use client"; // This is a client component 👈🏽
import { ReactNode, useEffect, useState } from "react";
import styles from "./layout.module.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth < window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return (
    <div>
      {isLandscape && (
        <div
          className={styles.landscapePrompt}
          onClick={() => setIsLandscape(false)}
        >
          <div className={styles.mainText}>
            Please switch to landscape mode for the best experience.
          </div>
          <div className={styles.secondaryText}>
            Click to disable this message.
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;
