import styles from "./Button.module.css";

type ButtonProps = {
  text?: string;
  icon?: JSX.Element;
  size?: "small" | "medium" | "large" | "none";
  iconSize?: "small" | "medium" | "large" | "none";
  className: string;
  disabled?: boolean;
  markedAsImportant?: boolean;
  onClick(): void;
};

const Button: React.FC<ButtonProps> = ({
  text = "",
  icon = undefined,
  size = "medium",
  iconSize = "mediumIcon",
  className = "",
  disabled = false,
  markedAsImportant = false,
  onClick,
}) => (
  <button
    className={`${
      markedAsImportant ? "markedAsImportant" : "notMarkedAsImportant"
    } 
    ${disabled ? styles.disabled : ""}
    ${className}`}
    onClick={onClick}
  >
    <div className={`${styles.button} ${styles[size]} `}>
      {text && <div>{text}</div>}
      {icon && (
        <div className={styles[iconSize]}>
          <div
            className={
              markedAsImportant ? "markedAsImportant" : "notMarkedAsImportant"
            }
          >
            {icon}
          </div>
        </div>
      )}
    </div>
  </button>
);

export default Button;
