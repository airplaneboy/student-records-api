"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("student-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setMounted(true);
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("student-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed right-5 top-5 z-50 rounded-full border px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-xl transition hover:scale-105"
      style={{
        background: "var(--card)",
        color: "var(--foreground)",
        borderColor: "var(--card-border)",
      }}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}