import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSettings } from "../api/studioApi";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(() => {
    return getSettings()
      .then(r => setSettings(r.data.data))
      .catch(err => console.error("Failed to load settings", err));
  }, []);

  useEffect(() => {
    fetchSettings().finally(() => setLoading(false));
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
