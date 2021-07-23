const ContentBoxComponent = {
  baseStyle: props => ({
    rounded: 'lg',
    bg: props.bgImg ? '' : 'blackAlpha.700',
    borderWidth: '1px',
    borderColor: 'whiteAlpha.200',
    p: 6,
    color: 'mode.900',
  }),

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
      boxShadow: '0px 5px 25px rgba(114,86,147,0.16)',
    },
  },
};

export default ContentBoxComponent;
