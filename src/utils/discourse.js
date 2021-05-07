import { graphQuery } from './apollo';
import { post } from './metadata';
import { PROPOSALS_DISCOURSE_TOPIC } from '../graphQL/proposal-queries';
import { getGraphEndpoint } from './chain';

export const createForumTopic = async ({
  chainID,
  daoID,
  afterTime,
  proposalId,
  proposalType,
  values,
  applicant,
  daoMetaData,
  sigData,
  autoOverride,
}) => {
  const canPost =
    autoOverride ||
    (daoMetaData?.boosts?.discourse?.active &&
      daoMetaData?.boosts?.discourse?.metadata?.autoProposal);
  if (canPost) {
    let title;
    let isAuto = false;
    if (!proposalId) {
      const graphRes = await graphQuery({
        endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
        query: PROPOSALS_DISCOURSE_TOPIC,
        variables: {
          molochAddress: daoID,
          createdAt: afterTime,
        },
      });

      title = `${
        graphRes.proposals[0] ? graphRes.proposals[0].proposalId : ''
      }: ${proposalType} - ${values.title}`;
      isAuto = true;
    } else {
      title = `${proposalId}: ${proposalType} - ${values.title}`;
    }

    const forumData = {
      description: values.description,
      link: values.link,
      title,
      applicant,
      category: daoMetaData.boosts.discourse.metadata.categoryId,
      shares: values.sharesRequested || '0',
      loot: values.lootRequested || '0',
      paymentRequested: values.paymentRequested || '0',
      tributeOffered: values.tributeOffered || '0',
      isAuto,
      ...sigData,
    };

    return post('dao/discourse-topic', forumData);
  }
  return false;
};
