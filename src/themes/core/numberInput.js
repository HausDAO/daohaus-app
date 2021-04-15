const NumberInput = {
  parts: ['field', 'addon'],
  baseStyle: {
    field: {
      borderColor: 'whiteAlpha.50',
      color: 'whiteAlpha.900',
      focusBorderColor: 'secondary.500',
    },
    addon: {
      color: 'whiteAlpha.900',
      bg: 'transparent',
      focusBorderColor: 'secondary.500',
    },
  },
  variants: {},
  sizes: {},
  defaultProps: {
    size: 'md',
    focusBorderColor: 'secondary.500',
  },
};

export default NumberInput;
