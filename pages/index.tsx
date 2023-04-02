import Head from "next/head";
import { useState, useRef } from "react";
import styles from "./index.module.scss";
import AudioRecorder from "../components/AudioRecorder/AudioRecorder";
import ChatWindow, { Message } from "../components/Chat/Chat";
import apiClient from "../utils/client/api-client";
import ChatInput from "../components/ChatInput/ChatInput";

// const fakeMessages = [
//   {
//     sender: "bot",
//     content: "Hello!",
//   },
//   { sender: "user", content: "Hello!" },
// ];

export default function Home() {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRef = useRef();

  const handleRecordingComplete = async (file: Blob) => {
    const { text } = await apiClient
      .convertAudio(file, password)
      .then((res) => res.json());
    if (text) {
      setUserInput(text);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const fetchResponse = async (input: string) => {
    try {
      setLoading(true);
      const response = await apiClient.generateResponse(input, password);
      const { text, audio } = await response.json();

      const newMessage: Message = {
        sender: "user",
        content: input,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      const newResponse: Message = {
        sender: "bot",
        content: text,
      };
      setMessages((prevMessages) => [...prevMessages, newResponse]);
      setUserInput("");
      const botSpeech = new Audio("data:audio/mp3;base64," + audio);
      setLoading(false);
      botSpeech.play();
    } catch (e) {
      console.log("errorr");
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    fetchResponse(message);
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <div>
          Enter Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <ChatWindow messages={messages} loading={loading} />
        <div className={styles.divider} />
        <div className={styles.controls}>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          <ChatInput
            value={userInput}
            onChange={handleChange}
            submitRef={submitRef}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
}
