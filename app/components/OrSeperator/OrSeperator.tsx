import styles from "./OrSeperator.module.css";

export const OrSeperator: React.FC = () => {
  return (
    <div className={styles.orSeparator}>
      <span className={styles.line}></span>
      <span className={styles.orText}>OR</span>
      <span className={styles.line}></span>
    </div>
  );
};
