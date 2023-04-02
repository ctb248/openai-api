import * as React from "react";
// import AudioRecorder from "audio-recorder-polyfill";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component }) {
  // 2. Use at the root of your app
  return (
    <NextUIProvider>
      <Component />
    </NextUIProvider>
  );
}
