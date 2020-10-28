import { gql } from 'apollo-boost';

export const PROPOSALS_LIST = gql`
  query proposals($contractAddr: String!, $skip: Int) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalId
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      aborted
      cancelled
      details
      didPass
      gracePeriodEnds
      guildkick
      lootRequested
      newMember
      paymentRequested
      paymentTokenDecimals
      paymentTokenSymbol
      processed
      proposalId
      proposalIndex
      sharesRequested
      sponsored
      startingPeriod
      trade
      tributeOffered
      tributeTokenDecimals
      tributeTokenSymbol
      votingPeriodStarts
      votingPeriodEnds
      whitelist

      moloch {
        gracePeriodLength
        periodDuration
        version
        votingPeriodLength
      }

      status @client
      proposalType @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
    }
  }
`;
