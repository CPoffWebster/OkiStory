import styles from "./Button.module.css";

type ButtonProps = {
  text?: string;
  icon?: JSX.Element;
  size?: "xsmall" | "small" | "medium" | "large" | "none";
  iconSize?: "small" | "medium" | "large" | "none";
  className: string;
  disabled?: boolean;
  disabledMessage?: string;
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
  disabledMessage,
  markedAsImportant = false,
  onClick,
}) => (
  <div className={`${disabled ? styles.disabledWrapper : ""}`}>
    <button
      className={` ${styles.button} ${
        markedAsImportant ? "markedAsImportant" : "notMarkedAsImportant"
      } 
    ${disabled ? styles.disabled : ""}
    ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={`${styles.buttonContents} ${styles[size]} `}>
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
      {disabled && disabledMessage && (
        <div className={styles.tooltip}>{disabledMessage}</div>
      )}
    </button>
  </div>
);

export default Button;
