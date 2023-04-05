import { Button, Tooltip } from "@nextui-org/react";
import React, { useState, useRef, FC } from "react";
import { BsFillMicFill, BsStopFill } from "react-icons/bs";
import styles from "./AudioRecorder.module.scss";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

const AudioRecorder: FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioChunksRef = useRef([]);

  const mediaRecorderRef = useRef(null);

  const handleToggleRecording = async () => {
    if (!stream) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(audioStream);
        const mediaRecorder = new MediaRecorder(audioStream);
        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        });
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/ogg",
          });
          onRecordingComplete(audioBlob);
          setRecording(false);
        });
        mediaRecorderRef.current = mediaRecorder;
        setRecording(true);
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error(err);
      }
    } else if (recording) {
      mediaRecorderRef.current.stop();
    } else {
      setRecording(true);
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    }
  };

  return (
    <div className={styles.recorder}>
      <Tooltip content={"Record a message"} rounded color="invert">
        <button
          className={`${styles.recordButton} ${
            recording ? styles.recording : ""
          }`}
          onClick={handleToggleRecording}
        >
          {recording ? (
            <BsStopFill size={20} color="#fff" />
          ) : (
            <BsFillMicFill size={20} color="#fff" />
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default AudioRecorder;
