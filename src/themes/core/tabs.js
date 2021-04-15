const Tabs = {
  parts: ['root', 'tablist', 'tab', 'tabpanel', 'indicator'],
  baseStyle: {
    root: {
      color: 'whiteAlpha.500',
      borderColor: 'whiteAlpha.500',
    },
    tab: {
      bg: 'transparent',
      color: 'inherit',
      borderColor: 'inherit',
      borderBottom: '1px solid',
      _hover: {
        color: 'whiteAlpha.800',
        borderColor: 'whiteAlpha.800',
      },
      _focus: {
        color: 'whiteAlpha.900',
      },
      _selected: {
        color: 'white',
        borderColor: 'white',
      },
      _active: {
        color: 'white',
        borderColor: 'white',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
    tablist: {},
    tabpanel: {},
    indicator: {},
  },
  sizes: {},
  defaultProps: {},
};

export default Tabs;
