import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';

const AuditJsonDisplay = ({ log }) => {
  const updateName = log => {
    if (log.update.boostKey) {
      return `Boost: ${log.update.boostKey}`;
    }
    if (log.update.customThemeConfig) {
      return 'Custom Theme';
    }
    return 'Metadata';
  };
  return (
    <Accordion allowToggle border='none' borderWidth='0'>
      <AccordionItem border='none'>
        <h2>
          <AccordionButton>
            <AccordionIcon />
            <Box flex='1' textAlign='left' ml={1}>
              {updateName(log)}
            </Box>
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <pre>{JSON.stringify(log.update, null, 2)}</pre>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AuditJsonDisplay;
