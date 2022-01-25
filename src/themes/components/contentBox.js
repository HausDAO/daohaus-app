import { CARD_BG } from '../theme';

const ContentBoxComponent = {
  baseStyle: props => ({
    rounded: 'lg',
    bg: props.bgImg ? '' : CARD_BG,
    borderWidth: '1px',
    // border: 'none',
    borderColor: 'whiteAlpha.200',
    p: props.p || 6,
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
