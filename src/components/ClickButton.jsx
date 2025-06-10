import React from "react";
import styles from "../styles/ClickButton.module.scss";

const ClickButton = ({ onClick, disabled }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      Натисни!
    </button>
  );
};

export default ClickButton;
