import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Table, Thead, Tr, Th, Tbody, Td, Link } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import ContentBox from '../components/ContentBox';

const renderRow = (log, daoid, daochain) => {
  const createdAt = new Date(log.createdAt);
  const humanDate = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;

  return (
    <Tr key={log.createdAt}>
      <Td>{humanDate}</Td>
      <Td>
        <Link
          as={RouterLink}
          to={`/dao/${daochain}/${daoid}/profile/${log.updatedBy}`}
        >
          {log.updatedBy}
        </Link>
      </Td>
      <Td>{JSON.stringify(log?.update || {})}</Td>
    </Tr>
  );
};

const MetaAudit = ({ daoMetaData }) => {
  const { daoid, daochain } = useParams();

  return (
    <MainViewLayout header='Metadata Audit Log' isDao>
      <ContentBox w='100%'>
        {daoMetaData && daoMetaData.logs.length > 0 && (
          <Table size='sm' variant='simple'>
            <Thead>
              <Tr>
                <Th>Created At</Th>
                <Th>Updated By</Th>
                <Th>Update JSON</Th>
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

        {!daoMetaData || (!daoMetaData.logs.length && <Box>No Logs</Box>)}
      </ContentBox>
    </MainViewLayout>
  );
};

export default MetaAudit;
