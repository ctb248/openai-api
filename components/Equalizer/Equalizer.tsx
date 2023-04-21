import React, { useEffect, useRef, useState } from 'react';
import './Equalizer.css';

interface EqualizerProps {
  audioSrc: string;
}

export const Equalizer: React.FC<EqualizerProps> = ({ audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [intensities, setIntensities] = useState<number[]>([]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32; // Adjust this value to get desired number of bars in the equalizer
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateIntensities = () => {
      analyser.getByteFrequencyData(dataArray);
      setIntensities(Array.from(dataArray));
      requestAnimationFrame(updateIntensities);
    };

    updateIntensities();

    return () => {
      audioContext.close();
    };
  }, []);

  return (
    <div className="equalizer">
      <audio ref={audioRef} src={audioSrc} controls autoPlay />
      <div className="bars">
        {intensities.map((intensity, index) => (
          <div
            key={index}
            className="bar"
            style={{
              height: `${intensity}px`,
              animationDuration: `${100 + intensity * 0.1}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};