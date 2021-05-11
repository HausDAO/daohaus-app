const Input = {
  parts: ['field', 'addon'],
  baseStyle: {},
  variants: {
    outline: {
      field: {
        borderColor: 'whiteAlpha.400',
        color: 'whiteAlpha.900',
        _focus: {
          borderColor: 'secondary.500',
          boxShadow: '0 0 0 2px var(--chakra-colors-secondary-500)',
        },
      },
      addon: {
        borderColor: 'whiteAlpha.400',
        color: 'whiteAlpha.900',
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
