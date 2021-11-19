import React from 'react';
import { CardLabel, Heading, Label, Paragraph } from './typography';

const ContentBuilder = ({ content = [] }) =>
  content.map((item, index) => (
    <ContentFactory key={`${item.type}-${index}`} {...item} />
  ));

const ContentFactory = props => {
  const { type } = props;
  if (type === 'pars') return <Paragraph {...props} />;
  if (type === 'heading') return <Heading {...props} />;
  if (type === 'label') return <Label {...props} />;
  if (type === 'cardlabel') return <CardLabel {...props} />;
};

export default ContentBuilder;
