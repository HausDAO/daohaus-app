import React from 'react';
import { Box } from '@chakra-ui/react';

const AuditJsonDisplay = ({ log }) => {
  return (
    <Box>
      <pre
        /* eslint-disable */
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(log.update, null, 2),
          }}
        />
    </Box>
  );
};

export default AuditJsonDisplay;
