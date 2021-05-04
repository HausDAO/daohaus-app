import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  Flex,
  Image,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import TextBox from '../components/TextBox';
import { ipfsPost, ipfsPrePost } from '../utils/metadata';
import { useCustomTheme } from '../contexts/CustomThemeContext';

const ImageUploadModal = ({
  ipfsHash,
  setIpfsHash,
  setUploading,
  uploading,
  matchMeta,
  changeLabel,
  setLabel,
}) => {
  const { imageUploadModal, setImageUploadModal } = useOverlay();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const { daoid } = useParams();
  const { theme } = useCustomTheme();
  let upload = useRef();

  const handleBrowse = () => {
    upload.value = null;
    upload.click();
  };

  const handleFileSet = async () => {
    setImageUrl(URL.createObjectURL(upload.files[0]));
    const formData = new FormData();
    formData.append('file', upload.files[0]);
    setImageUpload(formData);
    setImageUploadModal(true);
  };

  const handleUpload = async () => {
    setUploading(true);
    const keyRes = await ipfsPrePost('dao/ipfs-key', {
      daoAddress: daoid,
    });
    const ipfsRes = await ipfsPost(keyRes, imageUpload);
    setIpfsHash(ipfsRes.IpfsHash);
    setImageUpload(null);
    setImageUrl(null);
    setUploading(false);
    setImageUploadModal(false);
  };

  const handleClose = () => {
    setImageUploadModal(false);
  };

  return (
    <>
      <Button
        id='avatarImg'
        variant='outline'
        onClick={() => {
          handleBrowse();
        }}
      >
        {ipfsHash || matchMeta ? changeLabel : setLabel}
      </Button>
      <input
        type='file'
        id='avatarImg'
        accept='image/gif, image/jpeg, image/png'
        multiple={false}
        style={{ display: 'none' }}
        ref={ref => (upload = ref)}
        onChange={e => handleFileSet(e)}
      />
      <Modal isOpen={imageUploadModal} onClose={handleClose} isCentered>
        <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
        <ModalContent
          rounded='lg'
          bg='black'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
        >
          <Flex align='center' direction='column'>
            <TextBox>How&apos;s this look?</TextBox>
            <Image src={imageUrl} maxH='500px' objectFit='cover' my={4} />
            <ButtonGroup>
              <Button
                variant='outline'
                onClick={handleBrowse}
                disabled={uploading}
              >
                Select Another
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                Confirm
              </Button>
            </ButtonGroup>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageUploadModal;
