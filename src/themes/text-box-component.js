export const TextBoxComponent = {
  baseStyle: (props) => ({
    color: props.colorScheme ? props.colorScheme : "whiteAlpha.700",
    fontFamily: "heading",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
  }),

  sizes: {
    xs: {
      fontSize: "xs",
    },
    sm: {
      fontSize: "sm",
    },
    md: {
      fontSize: "md",
      fontWeight: 700,
    },
    lg: {
      fontSize: "lg",
      fontWeight: 700,
    },
    xl: {
      fontSize: "xl",
      fontWeight: 700,
    },
    "2xl": {
      fontSize: "2xl",
      fontWeight: 800,
    },
    "3xl": {
      fontSize: "3xl",
      fontWeight: 800,
    },
    "4xl": {
      fontSize: "4xl",
      fontWeight: 900,
    },
  },
  variants: {
    label: (props) => ({
      color: props.colorScheme ? props.colorScheme : "whiteAlpha.700",
      fontFamily: "heading",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
    }),
    value: (props) => ({
      color: props.colorScheme ? props.colorScheme : "whiteAlpha.900",
      fontFamily: "mono",
      textTransform: "none",
      mt: "9px",
    }),
  },
};
