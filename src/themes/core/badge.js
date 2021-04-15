const Badge = {
  baseStyle: {
    fontSize: 'xs',
    fontWeight: '400',
  },
  variants: {
    solid: () => ({}),
    outline: () => ({
      color: 'whiteAlpha.700',
    }),
  },
  sizes: {},
  defaultProps: {
    variant: 'outline',
  },
};

export default Badge;
