import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';

import { SketchPicker } from 'react-color';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';

const ColorPicker = props => {
  const { label, name, localForm } = props;
  const { setValue, register } = localForm;
  const { theme } = useCustomTheme();
  const [pickerOpen, setPickerOpen] = useState(null);
  const [colors, setColors] = useState({
    color: theme.colors.primary[500],
  });

  useEffect(() => {
    register(name);
    setValue(name, theme.colors.primary[500].replace('#', ''));
  }, []);

  const handleChange = (color, item) => {
    setColors(prevState => {
      return {
        ...prevState,
        [item]: color.hex,
      };
    });
    setValue(name, color.hex.replace('#', ''));
  };

  return (
    <Flex justify='flex-start' align='center' mb={10}>
      <TextBox size='sm'>{label}</TextBox>
      <Box>
        <Box
          w='35px'
          h='35px'
          borderRadius='25px'
          border='1px solid white'
          bg={colors.color}
          ml={5}
          onClick={() => setPickerOpen('color')}
          _hover={{ cursor: 'pointer' }}
        />
        {pickerOpen === 'color' ? (
          <Box position='absolute' zIndex={5}>
            <Box
              position='fixed'
              top='0px'
              right='0px'
              bottom='0px'
              left='0px'
              onClick={() => setPickerOpen(null)}
            />
            <SketchPicker
              color={colors.color}
              onChangeComplete={color => handleChange(color, 'color')}
              disableAlpha
            />
          </Box>
        ) : null}
      </Box>
    </Flex>
  );
};
export default ColorPicker;
