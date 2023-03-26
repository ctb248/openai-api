import { Button } from "@nextui-org/react";
import React, { useState, useRef, FC } from "react";
import { BsFillMicFill, BsStopFill } from "react-icons/bs";
import styles from "./AudioRecorder.module.scss";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

const AudioRecorder: FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [stream, setStream] = useState(null);
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
            type: "audio/wav",
          });
          onRecordingComplete(audioBlob);
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
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
      <Button
        onClick={handleToggleRecording}
        color={recording ? "warning" : "primary"}
      >
        {recording ? (
          <span>
            Stop recording
            <BsStopFill style={{ marginLeft: 10 }} size={18} />
          </span>
        ) : (
          <span>
            Start Recording
            <BsFillMicFill style={{ marginLeft: 10 }} size={18} />
          </span>
        )}
      </Button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
};

export default AudioRecorder;
