import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Box, Flex } from '@chakra-ui/layout';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';

const ColorPicker = props => {
  const { label, name, localForm } = props;
  const { setValue, register } = localForm;
  const { theme } = useCustomTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
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

  const handleClick = () => setPickerOpen(prevState => !prevState);
  return (
    <Flex justify='flex-start' align='flex-start' h='295px'>
      <Flex alignItems='center' mt={4}>
        <TextBox size='sm'>{label}</TextBox>
        <Box>
          <Box
            w='35px'
            h='35px'
            borderRadius='25px'
            border='1px solid white'
            bg={colors.color}
            ml={5}
            onClick={handleClick}
            name='color'
            _hover={{ cursor: 'pointer' }}
          />
          {pickerOpen && (
            <Box position='absolute' zIndex={5}>
              <Box
                position='fixed'
                name='close'
                top='0px'
                right='0px'
                bottom='0px'
                left='0px'
                onClick={handleClick}
              />
              <SketchPicker
                color={colors.color}
                onChangeComplete={color => handleChange(color, 'color')}
                disableAlpha
              />
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
export default ColorPicker;
