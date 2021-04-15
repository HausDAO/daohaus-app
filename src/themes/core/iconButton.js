const IconButton = {
  // 1. Update the base styles
  baseStyle: {
    borderRadius: '9999px',
    _hover: { scale: '5' },
  },
  // 2. Add a new button size or extend existing
  sizes: {},
  // 3. Add a new visual variant
  defaultProps: { isRound: 'true' },
  variants: {
    primary: {
      bg: 'primary.400',
      _hover: { bg: 'primary.500' },
    },
    // 4. Override existing variants
    solid: () => ({
      bg: 'secondary.400',
      color: 'white',
      _hover: { bg: 'secondary.500', color: 'white' },
      _focus: {
        bg: 'secondary.500',
        color: 'white',
        boxShadow: '0 0 0 3px blackAlpha.600',
      },
      _active: { bg: 'inherit' },
    }),
    outline: () => ({
      borderColor: 'secondary.400',
      bg: 'transparent',
      color: 'secondary.400',
      _hover: {
        borderColor: 'secondary.500',
        color: 'secondary.500',
        bg: 'transparent',
      },
      _active: { bg: 'inherit' },
    }),
    ghost: () => ({
      bg: 'transparent',
      color: 'whiteAlpha.900',
      _hover: {
        borderColor: 'secondary.500',
        color: 'secondary.500',
        bg: 'whiteAlpha.900',
      },
      _active: { bg: 'inherit' },
    }),
  },
};

export default IconButton;
