const ContentBoxComponent = {
  baseStyle: {
    rounded: 'lg',
    bg: 'blackAlpha.700',
    borderWidth: '1px',
    borderColor: 'whiteAlpha.200',
    p: 6,
  },

  sizes: {
    sm: {
      fontSize: '12px',
      padding: '16px',
    },
    md: {
      fontSize: '16px',
      padding: '24px',
    },
  },
  variants: {
    superBig: {
      fontSize: '100px',
    },
    d2: {
      bg: 'linear-gradient(to bottom, #FFF7FD 0%, #F2F7FF 100%)',
      rounded: 'xl',
    },
  },
};

export default ContentBoxComponent;
