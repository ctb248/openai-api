import React, { createContext, useCallback, useState } from "react";
// import AudioRecorder from "audio-recorder-polyfill";
import Header from "../components/Navbar/Navbar";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";

interface GlobalState {
  tab: string;
  error: string | null;
}

interface AppContext {
  state: GlobalState;
  updateGlobalState: (newState: Partial<GlobalState>) => void;
}

const AppContext = createContext<AppContext>({} as AppContext);

export default function App({ Component }) {
  const [globalState, setGlobalState] = useState<GlobalState>({
    tab: "gpt",
    error: null,
  });

  const updateGlobalState = useCallback(
    (newState: Partial<GlobalState>) => {
      setGlobalState({ ...globalState, ...newState });
    },
    [globalState, setGlobalState]
  );

  return (
    <NextUIProvider>
      <AppContext.Provider value={{ state: globalState, updateGlobalState }}>
        <Header />
        <Component />
      </AppContext.Provider>
    </NextUIProvider>
  );
}
