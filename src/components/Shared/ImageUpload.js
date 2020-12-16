import { Button } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

const ImageUpload = ({ setNewImage }) => {
  let upload = useRef();
  // TODO: can pass any of these down
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    //do we need to prefill existing from current theme?
    // if (pic exists?) {
    // setImageUrl(some url);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBrowse = () => {
    upload.value = null;
    upload.click();
  };

  const handleFileSet = async (e) => {
    setImageUrl(URL.createObjectURL(upload.files[0]));
    const formData = new FormData();
    formData.append('file', upload.files[0]);
    setNewImage(formData);
  };

  return (
    <>
      <input
        type='file'
        name='daoImage'
        accept='image/gif, image/jpeg, image/png'
        multiple={false}
        style={{ display: 'none' }}
        ref={(ref) => (upload = ref)}
        onChange={(e) => handleFileSet(e)}
      />
      {imageUrl ? (
        <img src={imageUrl} alt='avatar' onClick={handleBrowse} />
      ) : (
        <Button onClick={handleBrowse}>Find Image</Button>
      )}
    </>
  );
};

export default ImageUpload;
