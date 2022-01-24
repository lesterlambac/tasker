const colors = require("tailwindcss/colors");

const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  mode: "jit",
  purge: [],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        teal: colors.teal,
        cyan: colors.cyan,
        rose: colors.rose,

        primary: {
          DEFAULT: "#51459E",
          light: "#7467C2",
          lighter: "#B5ACF2",
          lightest: "#F2F7FF",
        },

        grey: {
          DEFAULT: "#808191",
          light: "#f9fbfd",
          stroke: "#F0F0F7",
          line: "#edf2f9;",
        },

        secondary: "#CBEE47",
        ternary: "#EEEDFD",

        black: "#1B1C31",
        green: "#27AE60",
        yellow: "#F2C94C",

        border: "#D1D1D1",
        line: "#F1F1F1",
        link: "#5045E4",

        background: "#F8F8F8",
        brown: "#FAF6F3",
        
        error: "#EB5757",
        red: "#EB5757",
        form: {
          dropdown: "#EDE0D4"
        }
      },
      boxShadow: {
        'card': '0 0.75rem 1.5rem rgb(18 38 63 / 3%)',
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily["sans"]],
        secondary: ["Gilroy"]
      },
      minWidth: {
        "40": "10rem",
        "44": "11rem"
      },
      maxWidth: {
        "100": "25rem",
        'container': '1300px',
      },
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
      },
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")]
};
