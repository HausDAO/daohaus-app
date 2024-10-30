import React, { useState, useEffect } from 'react';

import MDEditor from '@uiw/react-md-editor';
import { Box } from '@chakra-ui/react';

const markdown = `
  # Header 1
  ## Header 2

  _ italic _

  ** bold **

  <b> bold Html </b>
  `;

const MarkdownEditor = props => {
  const {
    localForm: { setValue },
    name,
  } = props;
  const [content, setContent] = useState(markdown);
  useEffect(() => {
    setValue(name, content);
  }, [content]);

  return (
    <Box mb={3}>
      <MDEditor value={content} onChange={setContent} />
    </Box>
  );
};

export default MarkdownEditor;
