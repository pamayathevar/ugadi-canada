import { RewardAccount, RewardOffer } from '../domain/commerce';

export const demoRewardAccount: RewardAccount = {
  pointsBalance: 1240,
  lifetimePoints: 2680,
  tier: 'harvest',
  nextTierPoints: 3000,
};

export const rewardOffers: RewardOffer[] = [
  {
    id: 'market-five',
    name: '$5 market reward',
    description: 'A little thank-you for your next Ugadi order.',
    pointsCost: 500,
    discountCents: 500,
    minimumSubtotalCents: 2500,
  },
  {
    id: 'market-ten',
    name: '$10 market reward',
    description: 'Make the season sweeter with $10 off your basket.',
    pointsCost: 900,
    discountCents: 1000,
    minimumSubtotalCents: 5000,
  },
  {
    id: 'harvest-twenty',
    name: '$20 harvest reward',
    description: 'Our most generous reward for a full family shop.',
    pointsCost: 1600,
    discountCents: 2000,
    minimumSubtotalCents: 9000,
  },
];

export const rewardActivity = [
  { id: 'UG-1048', label: 'Order UG-1048', date: 'August 8', points: 60 },
  { id: 'welcome', label: 'Harvest member welcome', date: 'August 1', points: 250 },
  { id: 'UG-1029', label: 'Order UG-1029', date: 'July 24', points: 33 },
];
