module.exports = {
  content: [
    "./themes/**/layouts/**/*.html",
    "./content/**/layouts/**/*.html",
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
  ],

  darkMode: "class",

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1rem",
        lg: "1.25rem",
        xl: "1.50rem",
        "2xl": "2rem",
      },
    },

    extend: {
      colors: {
        "white-dark": "#d4d4d4",
        "black-dark": "#1e1e1e",
        magenta: {
          DEFAULT: "#af00db",
          dark: "#c678dd",
        },
        gray: {
          DEFAULT: "d4d4d4",
          dark: "#808080",
        },
      },
    },
  },
  /* extend: {
      typography: ({ theme }) => ({
        vscode: {
          css: {
            "--tw-prose-body": theme("colors.red[500]"),
            "--tw-prose-headings": theme("colors.pink[900]"),
            "--tw-prose-lead": theme("colors.pink[700]"),
            "--tw-prose-links": "#af00db",
            "--tw-prose-bold": theme("colors.pink[900]"),
            "--tw-prose-counters": theme("colors.pink[600]"),
            "--tw-prose-bullets": theme("colors.pink[400]"),
            "--tw-prose-hr": theme("colors.pink[300]"),
            "--tw-prose-quotes": theme("colors.pink[900]"),
            "--tw-prose-quote-borders": theme("colors.pink[300]"),
            "--tw-prose-captions": theme("colors.pink[700]"),
            "--tw-prose-code": theme("colors.pink[900]"),
            "--tw-prose-pre-code": theme("colors.pink[100]"),
            "--tw-prose-pre-bg": theme("colors.pink[900]"),
            "--tw-prose-th-borders": theme("colors.pink[300]"),
            "--tw-prose-td-borders": theme("colors.pink[200]"),
            "--tw-prose-invert-body": theme("colors.pink"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-lead": theme("colors.pink[300]"),
            "--tw-prose-invert-links": theme("colors.white"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-counters": theme("colors.pink[400]"),
            "--tw-prose-invert-bullets": theme("colors.pink[600]"),
            "--tw-prose-invert-hr": theme("colors.pink[700]"),
            "--tw-prose-invert-quotes": theme("colors.pink[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.pink[700]"),
            "--tw-prose-invert-captions": theme("colors.pink[400]"),
            "--tw-prose-invert-code": theme("colors.white"),
            "--tw-prose-invert-pre-code": theme("colors.pink[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.pink[600]"),
            "--tw-prose-invert-td-borders": theme("colors.pink[700]"),
          },
        },
      }),
    },
  }, */
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
