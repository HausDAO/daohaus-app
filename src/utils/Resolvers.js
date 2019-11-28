import {
  determineProposalStatus,
  inGracePeriod,
  inVotingPeriod,
  inQueue,
  passedVotingAndGrace,
} from './ProposalHelper';
import { gql } from 'apollo-boost';
import { GET_METADATA } from './Queries';

export const resolvers = {
  apiData: async (moloch, _args) => {
    console.log(moloch);
    
    // let apiData = [];
    // try {
    //   const daoRes = await get(`moloch/${moloch.moloch}`);
    //   apiData = daoRes.data;
    // } catch (e) {
    //   console.log('error on dao api call', e);
    // }

    // if (apiData.isLegacy && apiData.graphNodeUri) {
    //   let legacyData = await legacyGraph(
    //     apiData.graphNodeUri,
    //     GET_MEMBERDATA_LEGACY,
    //   );
    //   apiData.legacyData = legacyData.data.data;
    // }

    // return apiData;
  },
  Proposal: {
    status: (proposal, _args, { cache }) => {
      const {
        currentPeriod,
        votingPeriodLength,
        gracePeriodLength,
      } = cache.readQuery({ query: GET_METADATA });
      return determineProposalStatus(
        proposal,
        +currentPeriod,
        +votingPeriodLength,
        +gracePeriodLength,
      );
    },
    gracePeriod: (proposal, _args, { cache }) => {
      const {
        currentPeriod,
        votingPeriodLength,
        gracePeriodLength,
      } = cache.readQuery({ query: GET_METADATA });

      if (
        inGracePeriod(
          proposal,
          currentPeriod,
          votingPeriodLength,
          gracePeriodLength,
        )
      ) {
        return (
          +proposal.startingPeriod +
          votingPeriodLength +
          gracePeriodLength -
          currentPeriod
        );
      }
      return 0;
    },
    votingEnds: (proposal, _args, { cache }) => {
      const { currentPeriod, votingPeriodLength } = cache.readQuery({
        query: GET_METADATA,
      });

      if (inVotingPeriod(proposal, currentPeriod, votingPeriodLength)) {
        return proposal.startingPeriod + votingPeriodLength - currentPeriod;
      }
      return 0;
    },
    votingStarts: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({ query: GET_METADATA });
      if (inQueue(proposal, currentPeriod)) {
        return proposal.startingPeriod - currentPeriod;
      }
      return 0;
    },
    readyForProcessing: (proposal, _args, { cache }) => {
      const {
        currentPeriod,
        votingPeriodLength,
        gracePeriodLength,
      } = cache.readQuery({ query: GET_METADATA });
      if (
        passedVotingAndGrace(
          proposal,
          currentPeriod,
          votingPeriodLength,
          gracePeriodLength,
        ) &&
        !proposal.processed
      ) {
        return true;
      }
      return false;
    },
  },
  Mutation: {
    setAttributes: (_, variables, { cache }) => {
      const id = `Proposal:${variables.id}`;
      const fragment = gql`
        fragment getMeta on Proposal {
          status
          gracePeriod
          votingEnds
          votingStarts
          readyForProcessing
        }
      `;
      const proposal = cache.readFragment({ fragment, id });
      const data = {
        ...proposal,
        status: variables.status,
        title: variables.title,
        description: variables.description,
        gracePeriod: variables.gracePeriod,
        votingEnds: variables.votingEnds,
        votingStarts: variables.votingStarts,
        readyForProcessing: variables.readyForProcessing,
      };
      cache.writeData({ id, data });
      return data;
    },
  },
};
