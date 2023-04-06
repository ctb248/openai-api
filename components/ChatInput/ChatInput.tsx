import React from "react";
import { BsSend } from "react-icons/bs";
import styles from "./ChatInput.module.scss";

const UserInput = ({ onSendMessage, value, onChange, submitRef }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === "") return;
    onSendMessage(value);
  };

  return (
    <form className={styles.userInput} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <textarea
          className={styles.inputField}
          placeholder="Type your message..."
          value={value}
          onChange={onChange}
        />
        <button ref={submitRef} className={styles.sendButton} type="submit">
          <BsSend size={20} color="#666" />
        </button>
      </div>
    </form>
  );
};

export default UserInput;
