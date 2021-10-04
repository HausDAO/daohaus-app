const Input = {
  parts: ['field', 'addon'],
  baseStyle: {
    color: 'mode.900',
    bg: 'transparent',
    colorScheme: 'mode',
    _focus: {
      borderColor: 'mode.900',
    },
  },
  variants: {
    outline: {
      field: {
        color: 'mode.900',
        bg: 'transparent',
        _focus: {
          borderColor: 'secondary.500',
          boxShadow: '0 0 0 2px var(--chakra-colors-secondary-500)',
        },
      },
      addon: {
        borderColor: 'mode.900',
        color: 'white',
        bg: 'transparent',
        _focus: {
          borderColor: 'secondary.500',
        },
      },
    },
  },
  sizes: {},
  defaultProps: {
    size: 'md',
    _focus: {
      borderColor: 'secondary.500',
    },
  },
};

export default Input;
