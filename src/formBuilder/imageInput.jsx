import React, { useEffect, useState } from 'react';
import { Image, HStack } from '@chakra-ui/react';
import FieldWrapper from './fieldWrapper';
import ImageUploadModal from '../modals/imageUploadModal';
import { themeImagePath } from '../utils/metadata';

const ImageInput = props => {
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const { setValue, values, name, defaultValues } = props;

  useEffect(async () => {
    if (ipfsHash) {
      const imgUrl = `https://ipfs.infura.io/ipfs/${ipfsHash}`;
      const resp = await fetch(imgUrl);
      const blob = await resp.blob();
      const img = document.createElement('img');
      img.onload = () => {
        setValue(name, {
          original: {
            src: `ipfs://${ipfsHash}`,
            mimeType: blob.type,
            size: blob.size,
            width: img.naturalWidth,
            height: img.naturalHeight,
          },
        });
      };
      img.src = imgUrl;
    }
  }, [ipfsHash]);

  useEffect(() => {
    if (defaultValues?.[name]?.original?.src) {
      const hash = defaultValues?.[name]?.original?.src.match(
        '(?<=ipfs://).+',
      )?.[0];
      if (hash) {
        setIpfsHash(hash);
      }
    }
  }, [defaultValues?.[name]?.original?.src]);

  return (
    <FieldWrapper {...props}>
      <HStack spacing={4}>
        {ipfsHash || values?.[name] ? (
          <>
            <Image
              src={themeImagePath(ipfsHash)}
              alt='brand image'
              w='50px'
              h='50px'
            />
          </>
        ) : null}
        <ImageUploadModal
          ipfsHash={ipfsHash}
          setIpfsHash={setIpfsHash}
          setUploading={setUploading}
          uploading={uploading}
          matchMeta={values?.[name]}
          setLabel='Upload Avatar'
          changeLabel='Change Avatar'
        />
      </HStack>
    </FieldWrapper>
  );
};

export default ImageInput;
