import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  frameRate: string;
  setFrameRate: (value: string) => void;
  quality: boolean;
  setQuality: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [frameRate, setFrameRate] = useState("30");
  const [quality, setQuality] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        frameRate,
        setFrameRate,
        quality,
        setQuality,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
