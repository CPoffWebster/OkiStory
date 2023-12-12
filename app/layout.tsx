import { ReactNode, useEffect, useState } from "react";
import styles from "./Layout.module.css";

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
        <div className={styles.landscapePrompt}>
          Please switch to portrait mode for the best experience.
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;
