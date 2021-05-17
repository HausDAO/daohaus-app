const Button = {
  // 1. Update the base styles
  baseStyle: {
    fontWeight: 'medium', // Normally, it's "semibold"
    _hover: { scale: '1.05' },
  },
  // 2. Add a new button size or extend existing
  sizes: {},
  // 3. Add a new visual variant
  variants: {
    primary: {
      color: 'white',
      bg: 'primary.400',
      _hover: { bg: 'primary.500' },
    },
    sideNav: {
      bg: 'transparent',
      color: 'whiteAlpha.900',
      borderRadius: '9999px',
      height: '56px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      _hover: { bg: 'transparent', color: 'secondary.500', scale: '1' },
      _active: {
        boxShadow: 'none',
        borderColor: 'transparent',
        outline: 'none',
        backgroundColor: 'white',
      },
      _focus: {
        boxShadow: 'none',
        borderColor: 'transparent',
        outline: 'none',
      },
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
  },
};

export default Button;
