import React, { FC } from "react";
import { GiRobotAntennas } from "react-icons/gi";
import LoadingScreen from "../Loading/Loading";
import styles from "./Chat.module.scss";

export interface Message {
  sender: "bot" | "user";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
}

const ChatWindow: FC<ChatWindowProps> = ({ messages, loading }) => {
  const renderMessages = () => {
    if (messages.length > 0) {
      return messages.map((message, index) => (
        <li
          key={index}
          className={`${styles.messageItem} ${
            message.sender === "user" ? styles.userMessage : styles.botMessage
          }`}
        >
          <div className={styles.sender}>
            {message.sender === "user" ? "You" : "ChatBot"}
          </div>
          <div className={styles.content}>{message.content}</div>
        </li>
      ));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.placeholder}>
        <GiRobotAntennas size={100} color="#a4a4a4" className={styles.icon} />
        <h2>Speak to me, fleshbag</h2>
      </div>
      <ul className={styles.messageList}>{renderMessages()}</ul>
    </div>
  );
};

export default ChatWindow;
