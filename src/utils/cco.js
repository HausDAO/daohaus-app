import { timeToNow } from './general';

export const countDownText = (round) => {
  const now = new Date() / 1000;
  if (now < round.startTime) {
    return `Round ${round.round} starts ${timeToNow(round.startTime)}`;
  } else {
    return `Round ${round.round} ends ${timeToNow(round.endTime)}`;
  }
};
