const TextBoxComponent = {
  baseStyle: props => ({
    color: props.color || 'mode.900',
    textAlign: props.textAlign || null,
    fontFamily: 'heading',
    textTransform: props.textTransform || 'uppercase',
    letterSpacing: '0.15em',
    opacity: props.opacity || 1.0,
    padding: props.p || props.padding || 0,
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
      fontWeight: 700,
    },
    lg: {
      fontSize: 'lg',
      fontWeight: 700,
    },
    xl: {
      fontSize: 'xl',
      fontWeight: 700,
    },
    '2xl': {
      fontSize: '2xl',
      fontWeight: 800,
    },
    '3xl': {
      fontSize: '3xl',
      fontWeight: 800,
    },
    '4xl': {
      fontSize: '4xl',
      fontWeight: 900,
    },
  },
  variants: {
    label: props => ({
      color: props.color || 'mode.900',
      textAlign: props.textAlign || null,
      fontFamily: 'heading',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      opacity: 0.7,
    }),
    value: props => ({
      color: props.color || 'mode.900',
      textAlign: props.textAlign || null,
      fontFamily: 'mono',
      textTransform: 'none',
      mt: '9px',
    }),
    body: props => ({
      color: props.color || 'mode.900',
      textAlign: props.textAlign || null,
      fontFamily: 'body',
      textTransform: props.textTransform || 'none',
      fontWeight: props.fontWeight || 400,
      opacity: props.opacity || 1.0,
      padding: 0,
    }),
  },
};

export default TextBoxComponent;
