import Head from "next/head";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import styles from "./index.module.scss";
import AudioRecorder from "../components/AudioRecorder/AudioRecorder";
import apiClient from "../utils/client/api-client";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState();

  // const getModels = async () => {
  //   try {
  //     const response = await fetch("/api/models");
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (e) {
  //     alert(e.message);
  //   }
  // };

  // async function onSubmit(event) {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch("/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ animal: userInput }),
  //     });

  //     const data = await response.json();
  //     if (response.status !== 200) {
  //       throw (
  //         data.error ||
  //         new Error(`Request failed with status ${response.status}`)
  //       );
  //     }

  //     setResults(data.result);
  //     setUserInput("");
  //   } catch (error) {
  //     // Consider implementing your own error handling logic here
  //     console.error(error);
  //     alert(error.message);
  //   }
  // }

  const handleRecordingComplete = async (file: Blob) => {
    const res = await apiClient.convertAudio(file);
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.results}>{results}</div> */}
        <div className="controls">
          {/* <Button onClick={getModels}>Get Models</Button> */}
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </div>
      </main>
    </div>
  );
}
