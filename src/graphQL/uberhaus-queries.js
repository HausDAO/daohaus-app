import { gql } from 'apollo-boost';

export const UBERHAUS_DATA = gql`
  query moloch(
    $molochAddress: String!
    $memberAddress: String!
    $minionId: String!
  ) {
    moloch(id: $molochAddress) {
      id
      members(where: { memberAddress: $memberAddress }) {
        memberAddress
        createdAt
        loot
        shares
      }
      proposals(where: { applicant: $memberAddress }) {
        id
        cancelled
        processed
        newMember
      }
    }
    minion(id: $minionId) {
      minionType
      proposals {
        id
        cancelled
        processed
        newMember
        details
      }
    }
  }
`;

// id
// aborted
// applicant
// cancelled
// cancelledAt
// createdAt
// details
// didPass
// gracePeriodEnds
// guildkick
// isMinion
// lootRequested
// memberAddress
// newMember
// noShares
// noVotes
// paymentRequested
// paymentTokenDecimals
// paymentTokenSymbol
// processed
// processor
// processedAt
// proposer
// proposalId
// proposalIndex
// sharesRequested
// sponsored
// sponsor
// sponsoredAt
// startingPeriod
// trade
// tributeOffered
// tributeTokenDecimals
// tributeTokenSymbol
// tributeToken
// votingPeriodStarts
// votingPeriodEnds
// whitelist
// yesShares
// yesVotes
// molochAddress
// molochVersion
// minionAddress
// moloch {
//   gracePeriodLength
//   periodDuration
//   version
//   votingPeriodLength
// }
// votes {
//   id
//   memberAddress
//   memberPower
//   uintVote
//   createdAt
//   molochAddress
// }
