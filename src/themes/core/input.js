const Input = {
  parts: ['field', 'addon'],
  baseStyle: ({ colorMode }) => ({
    color: colorMode === 'light' ? 'blackAlpha.900' : 'whiteAlpha.900',
  }),
  variants: ({ colorMode }) => ({
    outline: {
      field: {
        color: colorMode === 'light' ? 'blackAlpha.900' : 'whiteAlpha.900',
        bg: 'transparent',
        borderColor:
          colorMode === 'light' ? 'blackAlpha.400' : 'whiteAlpha.400',
        _focus: {
          borderColor: 'secondary.500',
          boxShadow: '0 0 0 2px var(--chakra-colors-secondary-500)',
        },
      },
      addon: {
        borderColor:
          colorMode === 'light' ? 'blackAlpha.400' : 'whiteAlpha.400',
        color: colorMode === 'light' ? 'blackAlpha.900' : 'whiteAlpha.900',
        bg: 'transparent',
        _focus: {
          borderColor: 'secondary.500',
        },
      },
    },
  }),
  sizes: {},
  defaultProps: {
    size: 'md',
    _focus: {
      borderColor: 'secondary.500',
    },
  },
};

export default Input;
