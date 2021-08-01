// import React from 'react';
// import {
//   Modal as ChakraModal,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   ModalOverlay,
//   Box,
// } from '@chakra-ui/react';
// import { rgba } from 'polished';

// import { useOverlay } from '../contexts/OverlayContext';
// import { useCustomTheme } from '../contexts/CustomThemeContext';
// import FormBuilder from '../formBuilder/formBuilder';

// const getMaxWidth = modal => {
//   if (modal?.formLego) {
//     const { layout } = modal?.formLego;
//     if (layout === 'doubleColumn') return '800px';
//     if (layout === 'singleColumn') return '500px';
//   }
//   if (modal?.width === 'sm') return '400px';
//   if (modal?.width === 'md') return '500px';
//   if (modal?.width === 'lg') return '650px';
//   if (modal?.width === 'xl') return '600px';
//   if (modal?.width?.includes('px')) return modal?.width;
//   return '500px';
// };

// const Modal = () => {
//   const { theme } = useCustomTheme();
//   const { modal, setModal } = useOverlay();
//   const header =
//     modal?.formLego?.header ||
//     modal?.formLego?.title ||
//     modal?.header ||
//     modal?.title;

//   const handleClose = () => setModal(false);

//   return (
//     <ChakraModal
//       isOpen={modal}
//       onClose={handleClose}
//       closeOnOverlayClick={false}
//       isCentered
//     >
//       <ModalOverlay
//         bgColor={rgba(theme.colors.background[500], 0.8)}
//         style={{ backdropFilter: 'blur(6px)' }}
//       />
//       <ModalContent
//         rounded='lg'
//         bg='blackAlpha.600'
//         borderWidth='1px'
//         borderColor='whiteAlpha.200'
//         maxWidth={getMaxWidth(modal)}
//         p={3}
//       >
//         <ModalHeader>
//           <Box
//             fontFamily='heading'
//             textTransform='uppercase'
//             fontSize='xs'
//             fontWeight={700}
//             color='#7579C5'
//             mb={4}
//           >
//             {header}
//           </Box>
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {modal?.formLego ? <FormBuilder {...modal.formLego} /> : modal?.body}
//         </ModalBody>
//         <ModalFooter>{modal?.footer}</ModalFooter>
//       </ModalContent>
//     </ChakraModal>
//   );
// };

// export default Modal;
