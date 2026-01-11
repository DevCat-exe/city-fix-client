import { useEffect, useState } from "react";
import { DarkModeContext } from "./DarkModeContext";

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const html = document.querySelector("html");

    if (isDark) {
      html.setAttribute("data-theme", "dark");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
