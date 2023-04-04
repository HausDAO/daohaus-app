import React from 'react';
import { Box, Text, Link, Icon } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

// const colors = ['yellow.500', 'red.500', 'green.500', 'blue.500'];
const colors = ['white.500', 'red.600'];

const NoticeBanner = () => {
  // const [color, setColor] = useState(colors[1]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setColor(colors[Math.floor(Math.random() * colors.length)]);
  //   }, 50000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Box w='100%' backgroundColor={colors[1]} p='20px' textAlign='center'>
      <Text fontSize='xl' fontWeight='700'>
        👹 DEATH TO MOLOCH! LONG LIVE THE NEW MOLOCH! 👹
      </Text>
      <Text fontSize='md' fontStyle='mono'>
        With Moloch v3 we are on a path to a decentralized future. Learn more
        about how it impacts the features you know and love.
      </Text>
      <Link color='white' href='https://daohaus.club/' isExternal>
        <Text fontSize='md'>
          Learn more
          <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
        </Text>
      </Link>
    </Box>
  );
};

export default NoticeBanner;
