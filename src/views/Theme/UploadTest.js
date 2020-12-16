import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

import { ipfsPost, ipfsPrePost } from '../../utils/requests';
import ImageUpload from '../../components/Shared/ImageUpload';

const UploadTest = () => {
  const [newImage, setNewImage] = useState();

  const handleUpload = async () => {
    console.log('uploading', newImage);

    const keyRes = await ipfsPrePost('dao/ipfs-key', {
      daoAddress: '0x3b0d63e760faf910deb16c7f05dc75166b5c378f',
    });

    console.log('keyRes', keyRes);

    const ipfsRes = await ipfsPost(keyRes, newImage);

    console.log('ipfsRes', ipfsRes);
  };

  return (
    <div>
      Upload Me
      <ImageUpload setNewImage={setNewImage} />
      {newImage ? <Button onClick={handleUpload}>Upload</Button> : null}
    </div>
  );
};

export default UploadTest;
