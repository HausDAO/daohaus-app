const Popover = {
  parts: ['popper'],
  baseStyle: props => ({
    popper: {
      zIndex: 10,
      maxW: props.width ? props.width : 'xs',
      w: '100%',
    },
  }),
};

export default Popover;
