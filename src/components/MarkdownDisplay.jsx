import MDEditor from '@uiw/react-md-editor';
import React from 'react';
import styled from '@emotion/styled';

const CustomMarkdownStyles = styled.div`
  width: 100%;
  max-width: 700px;
  .wmde-markdown {
    font-family: 'Mulish';
    h1 {
      font-size: 1.8em;
      line-height: 1;
    }
    h2 {
      font-size: 1.4em;
      line-height: 1;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    border-bottom: none;
  }
`;

const MarkdownDisplay = ({ source }) => {
  return (
    <CustomMarkdownStyles>
      <MDEditor.Markdown source={source} />
    </CustomMarkdownStyles>
  );
};

export default MarkdownDisplay;
