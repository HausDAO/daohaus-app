import { Flex } from '@chakra-ui/react';
import TextBox from '../components/TextBox';

const GenericBlur = (props) => {
	         const {title} = props
            return (
							<Flex
              display={'flex'}
              w='100%'
              h='100%'
              backdropFilter='blur(2px)'
              position='absolute'
              zIndex={5}
              justify='center'
              align='center'
            >
              <TextBox w='40%' textAlign='center'>
								{title}
              </TextBox>
            </Flex> )
}

export default GenericBlur
