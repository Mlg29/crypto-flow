/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        sans: ["'Manrope'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#070B16",
          900: "#0B1220",
          800: "#111A2E",
          700: "#1A2540",
          600: "#243356",
          500: "#33477A",
        },
        paper: {
          DEFAULT: "#E9EAF6",
          dim: "#DEE1F1",
          card: "#FFFFFF",
        },
        cobalt: {
          400: "#6C8CFF",
          500: "#3D63F5",
          600: "#2B4BD9",
          700: "#213BAE",
        },
        orchid: {
          300: "#B9A6FF",
          400: "#9D82FF",
          500: "#7C5CFC",
          600: "#6640E8",
          700: "#5230C4",
        },
        sandbox: {
          DEFAULT: "#0FBFA8",
          dim: "#0A8C7C",
          light: "#E3FBF6",
        },
        success: { DEFAULT: "#1BA362", light: "#E4F7ED" },
        warning: { DEFAULT: "#D98A1B", light: "#FCF1DE" },
        danger: { DEFAULT: "#DE4F4F", light: "#FBE7E7" },
        chain: {
          btc: "#F7931A",
          eth: "#6C8CFF",
          trx: "#C8102E",
          bsc: "#F0B90B",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,18,32,0.06), 0 8px 24px -8px rgba(11,18,32,0.12)",
        glow: "0 0 0 1px rgba(61,99,245,0.15), 0 20px 60px -20px rgba(61,99,245,0.45)",
        glowViolet: "0 0 0 1px rgba(124,92,252,0.18), 0 20px 60px -20px rgba(124,92,252,0.55)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(60% 60% at 15% 10%, rgba(61,99,245,0.35) 0%, rgba(61,99,245,0) 60%), radial-gradient(50% 50% at 85% 20%, rgba(15,191,168,0.25) 0%, rgba(15,191,168,0) 60%), radial-gradient(70% 60% at 50% 100%, rgba(61,99,245,0.18) 0%, rgba(61,99,245,0) 60%)",
        meshViolet:
          "radial-gradient(55% 55% at 12% 8%, rgba(124,92,252,0.4) 0%, rgba(124,92,252,0) 60%), radial-gradient(45% 50% at 88% 15%, rgba(15,191,168,0.22) 0%, rgba(15,191,168,0) 60%), radial-gradient(70% 55% at 50% 105%, rgba(124,92,252,0.22) 0%, rgba(124,92,252,0) 60%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
