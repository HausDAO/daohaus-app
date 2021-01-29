import React from 'react';

const RenderTxList = () => {
  const txList = txProcessor.getTxList(user.username);
  const milisecondsAgo = 86400000; // 1 day
  // dummy data
  // txList.push({
  //   id: 1,
  //   tx: '0x123',tails.name: 'sponsorProposal',
  //   open: true,
  //   dateAdded: 1605157095244,
  // });
  // filter transactions that are more than a milisecondsAgo old
  return (
    <>
      {txList
        .filter((tx) => tx.dateAdded > Date.now() - milisecondsAgo)
        .reverse()
        .map((tx) => {
          return (
            <Box id={tx.tx} key={tx.tx} mb={6} _last={{ mb: 0 }}>
              <Flex
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Text color='white'>{DISPLAY_NAMES[tx.details.name]}</Text>
                <Box>
                  {tx.pendingGraph ? (
                    <Icon as={Spinner} name='check' color='white' />
                  ) : (
                    <Icon
                      as={RiCheckboxCircleLine}
                      name='check'
                      color='green.500'
                    />
                  )}
                  <ExplorerLink type={'tx'} hash={tx.tx} isIconLink={true} />
                </Box>
              </Flex>
            </Box>
          );
        })}
    </>
  );
};

export default RenderTxList;
