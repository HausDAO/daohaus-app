import React from 'react';
import {
  CardIncoming,
  CardLabel,
  Heading,
  Label,
  ParaMd,
} from '../components/typography';

const EMPH_TYEPS = { bold: '<b>', italic: '<i>' };

const interprateEmphasis = text => {
  text.reduce();
};

const ContentBuilder = ({ content = [] }) =>
  content.map((item, index) => {
    if (item.multiple?.length) {
      return item.multiple.map(subItem => (
        <SimpleContentFactory key={`${subItem.type}-${index}`} {...subItem} />
      ));
    }
    if (item.text) {
      return <SimpleContentFactory key={`${item.type}-${index}`} {...item} />;
    }
    throw new Error(
      'ContentBuilder.jsx => Did not receive the correct content type',
    );
  });

const SimpleContentFactory = props => {
  const { type } = props;
  const hasEmphasis = interprateEmphasis(props.text);
  if (type === 'par' || type === 'paraMd') return <ParaMd {...props} />;
  if (type === 'heading') return <Heading {...props} />;
  if (type === 'label') return <Label {...props} />;
  if (type === 'cardlabel') return <CardLabel {...props} />;
  if (type === 'cardIncoming') return <CardIncoming {...props} />;
};

const CompoundContentFactory = props => {};

export default ContentBuilder;
