// import React, { Fragment } from "react";
// import { Box } from "@chakra-ui/react";

// import { IsJsonString, timeToNow } from "./helpers";
// import TextBox from "../components/Shared/TextBox";
// import { formatDistanceToNow } from "date-fns";

// export const inQueue = (proposal) => {
//   const now = (new Date() / 1000) | 0;
//   return now < +proposal.votingPeriodStarts;
// };

// export const inVotingPeriod = (proposal) => {
//   const now = (new Date() / 1000) | 0;
//   return (
//     now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds
//   );
// };

// export const inGracePeriod = (proposal) => {
//   const now = (new Date() / 1000) | 0;
//   return now >= +proposal.votingPeriodEnds && now <= +proposal.gracePeriodEnds;
// };

// export const afterGracePeriod = (proposal) => {
//   const now = (new Date() / 1000) | 0;
//   return now > +proposal.gracePeriodEnds;
// };

// export const determineUnreadActivityFeed = (proposal) => {
//   const abortedOrCancelled = proposal.aborted || proposal.cancelled;
//   const now = (new Date() / 1000) | 0;
//   const inVotingPeriod =
//     now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds;
//   const needsMemberVote = inVotingPeriod && !proposal.votes.length;
//   const needsProcessing =
//     now >= +proposal.gracePeriodEnds && !proposal.processed;

//   let message;
//   if (!proposal.sponsored) {
//     message = "New and unsponsored";
//   }
//   if (needsProcessing) {
//     message = "Unprocessed";
//   }
//   if (needsMemberVote) {
//     message = "You haven't voted on this";
//   }

//   return {
//     unread:
//       !abortedOrCancelled &&
//       (needsMemberVote || needsProcessing || !proposal.sponsored),
//     message,
//   };
// };

// export const determineUnreadProposalList = (
//   proposal,
//   activeMember,
//   memberAddress
// ) => {
//   const abortedOrCancelled = proposal.aborted || proposal.cancelled;
//   const now = (new Date() / 1000) | 0;
//   const inVotingPeriod =
//     now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds;

//   const memberVoted = proposal.votes.some(
//     (vote) => vote.memberAddress.toLowerCase() === memberAddress.toLowerCase()
//   );
//   const needsMemberVote = activeMember && inVotingPeriod && !memberVoted;

//   const needsProcessing =
//     now >= +proposal.gracePeriodEnds && !proposal.processed;

//   let message;
//   if (!proposal.sponsored) {
//     message = "New and unsponsored";
//   }
//   if (needsProcessing) {
//     message = "Unprocessed";
//   }
//   if (needsMemberVote) {
//     message = "You haven't voted on this";
//   }

//   return {
//     unread:
//       !abortedOrCancelled &&
//       (needsMemberVote || needsProcessing || !proposal.sponsored),
//     message,
//   };
// };

// export const detailsToJSON = (values) => {
//   const details = {};
//   details.title = values.title;
//   // random string
//   details.hash = Math.random().toString(36).slice(2);
//   if (values.description) {
//     details.description = values.description;
//   }
//   if (values.link) {
//     details.link = values.link;
//   }
//   return JSON.stringify(details);
// };

// export const descriptionMaker = (proposal) => {
//   try {
//     const parsed = IsJsonString(proposal.details)
//       ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ""))
//       : "";
//     return parsed.description || "";
//   } catch (e) {
//     return "";
//   }
// };

// export const hashMaker = (proposal) => {
//   try {
//     const parsed =
//       IsJsonString(proposal.details) && JSON.parse(proposal.details);
//     return parsed.hash || "";
//   } catch (e) {
//     return "";
//   }
// };

// export const linkMaker = (proposal) => {
//   try {
//     const parsed =
//       IsJsonString(proposal.details) &&
//       JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ""));
//     return typeof parsed.link === "function" ? null : parsed.link || "";
//   } catch (e) {
//     return "";
//   }
// };

// export const isMinion = (proposal) => {
//   try {
//     const parsed = JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ""));
//     return {
//       isMinion: parsed.isMinion,
//       isTransmutation: parsed.isTransmutation,
//     };
//   } catch (e) {
//     if (proposal.details && proposal.details.indexOf("link:") > -1) {
//       const fixedDetail = proposal.details.replace("link:", '"link":');
//       const fixedParsed = JSON.parse(fixedDetail);
//       return {
//         isMinion: fixedParsed.isMinion,
//         isTransmutation: fixedParsed.isTransmutation,
//       };
//     } else {
//       console.log(`Couldn't parse JSON from metadata`);
//       return {
//         isMinion: false,
//         isTransmutation: false,
//       };
//     }
//   }
// };

// export function getProposalCountdownText(proposal) {
//   switch (proposal.status) {
//     case ProposalStatus.InQueue:
//       return (
//         <Fragment>
//           <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//             Voting Begins {timeToNow(proposal.votingPeriodStarts)}
//           </Box>
//         </Fragment>
//       );
//     case ProposalStatus.VotingPeriod:
//       return (
//         <Fragment>
//           <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//             Voting Ends {timeToNow(proposal.votingPeriodEnds)}
//           </Box>
//         </Fragment>
//       );
//     case ProposalStatus.GracePeriod:
//       return (
//         <Fragment>
//           <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//             <Box as="span" fontWeight={900}>
//               Grace Period Ends {timeToNow(proposal.gracePeriodEnds)}
//             </Box>
//           </Box>
//         </Fragment>
//       );
//     case ProposalStatus.Passed:
//       return (
//         <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//           Passed
//         </Box>
//       );
//     case ProposalStatus.Failed:
//       return (
//         <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//           Failed
//         </Box>
//       );
//     case ProposalStatus.Cancelled:
//       return (
//         <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//           Cancelled
//         </Box>
//       );
//     case ProposalStatus.ReadyForProcessing:
//       return (
//         <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//           Ready For Processing
//         </Box>
//       );
//     case ProposalStatus.Unsponsored:
//       return (
//         <Box textTransform="uppercase" fontSize="0.8em" fontWeight={700}>
//           Unsponsored
//         </Box>
//       );
//     default:
//       return <Fragment />;
//   }
// }

// export const getProposalDetailStatus = (proposal) => {
//   switch (proposal.status) {
//     case ProposalStatus.InQueue:
//       return (
//         <>
//           <TextBox size="xs">In Queue, Voting Begins</TextBox>
//           <TextBox size="lg" variant="value">
//             {formatDistanceToNow(
//               new Date(+proposal?.votingPeriodStarts * 1000),
//               {
//                 addSuffix: true,
//               }
//             )}
//           </TextBox>
//         </>
//       );
//     case ProposalStatus.VotingPeriod:
//       return (
//         <>
//           <TextBox size="xs">Voting Ends</TextBox>
//           <TextBox size="lg" variant="value">
//             {formatDistanceToNow(new Date(+proposal?.votingPeriodEnds * 1000), {
//               addSuffix: true,
//             })}
//           </TextBox>
//         </>
//       );
//     case ProposalStatus.GracePeriod:
//       return (
//         <>
//           <TextBox size="xs">Grace Period Ends</TextBox>
//           <TextBox size="lg" variant="value">
//             {formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
//               addSuffix: true,
//             })}
//           </TextBox>
//         </>
//       );
//     case ProposalStatus.ReadyForProcessing:
//       return (
//         <>
//           <TextBox size="xs">Ready For Processing</TextBox>
//           <TextBox size="lg" variant="value">
//             {formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
//               addSuffix: true,
//             })}
//           </TextBox>
//         </>
//       );
//     case ProposalStatus.Passed:
//     case ProposalStatus.Failed:
//       return (
//         <>
//           <TextBox size="xs">{proposal.status}</TextBox>
//           <TextBox size="lg" variant="value">
//             {formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
//               addSuffix: true,
//             })}
//           </TextBox>
//         </>
//       );
//     default:
//       return <Fragment />;
//   }
// };
