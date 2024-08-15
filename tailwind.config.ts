import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at 99% 33%, rgba(0,0,0, 0.14) 0%, rgba(0,0,0, 0.14) 37%,transparent 37%, transparent 100%),radial-gradient(circle at 46% 16%, rgba(0,0,0, 0.14) 0%, rgba(0,0,0, 0.14) 43%,transparent 43%, transparent 100%),radial-gradient(circle at 99% 25%, rgba(0,0,0, 0.14) 0%, rgba(0,0,0, 0.14) 22%,transparent 22%, transparent 100%),radial-gradient(circle at 57% 88%, rgba(0,0,0, 0.14) 0%, rgba(0,0,0, 0.14) 86%,transparent 86%, transparent 100%),radial-gradient(circle at 82% 78%, rgba(0,0,0, 0.14) 0%, rgba(0,0,0, 0.14) 22%,transparent 22%, transparent 100%),linear-gradient(90deg, rgb(22,26,32),rgb(22,26,32));",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow:{"left-side":"-1rem 0px 2.2rem -12px #000"},
      darkMode: 'class',
    },
  },
  plugins: [],
};
export default config;
