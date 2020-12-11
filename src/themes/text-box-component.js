export const TextBoxComponent = {
  baseStyle: (props) => ({
    color: props.colorScheme ? props.colorScheme : 'whiteAlpha.700',
    fontFamily: 'heading',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
  }),

  sizes: {
    xs: {
      fontSize: 'xs',
    },
    sm: {
      fontSize: 'sm',
    },
    md: {
      fontSize: 'md',
    },
    lg: {
      fontSize: 'lg',
    },
    xl: {
      fontSize: 'xl',
    },
  },
  variants: {
    label: (props) => ({
      color: props.colorScheme ? props.colorScheme : 'whiteAlpha.700',
      fontFamily: 'heading',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
    }),
    value: (props) => ({
      color: props.colorScheme ? props.colorScheme : 'whiteAlpha.900',
      fontFamily: 'mono',
      textTransform: 'none',
      mt: '9px',
    }),
  },
};
