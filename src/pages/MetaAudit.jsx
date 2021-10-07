import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FaCopy } from 'react-icons/fa';
import MainViewLayout from '../components/mainViewLayout';
import ContentBox from '../components/ContentBox';
import { truncateAddr } from '../utils/general';
import AuditJsonDisplay from '../components/auditJsonDisplay';

const renderRow = (log, daoid, daochain) => {
  const createdAt = new Date(log.createdAt);
  const humanDate = format(createdAt, 'd LLL y | h:mm aaa');

  return (
    <Tr key={log.createdAt}>
      <Td>{humanDate}</Td>
      <Td>
        <Link
          as={RouterLink}
          to={`/dao/${daochain}/${daoid}/profile/${log.updatedBy}`}
        >
          <CopyToClipboard text={log.updatedBy}>
            <Flex>
              {truncateAddr(log.updatedBy)}
              <Icon
                as={FaCopy}
                color='secondary.300'
                ml={2}
                _hover={{ cursor: 'pointer' }}
              />
            </Flex>
          </CopyToClipboard>
        </Link>
      </Td>
      <Td>
        <AuditJsonDisplay log={log} />
      </Td>
    </Tr>
  );
};

const MetaAudit = ({ daoMetaData }) => {
  const { daoid, daochain } = useParams();

  return (
    <MainViewLayout header='Metadata Audit Log' isDao>
      <ContentBox w='100%'>
        {daoMetaData?.logs?.length > 0 && (
          <Table size='md' variant='simple'>
            <Thead>
              <Tr>
                <Th fontSize='md' minW='240px'>
                  Created At
                </Th>
                <Th fontSize='md'>Updated By</Th>
                <Th fontSize='md'>JSON Update</Th>
              </Tr>
            </Thead>
            <Tbody>
              {daoMetaData?.logs
                .sort((a, b) => {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .map(log => {
                  return renderRow(log, daoid, daochain);
                })}
            </Tbody>
          </Table>
        )}

        {!daoMetaData || (!daoMetaData?.logs?.length && <Box>No Logs</Box>)}
      </ContentBox>
    </MainViewLayout>
  );
};

export default MetaAudit;
