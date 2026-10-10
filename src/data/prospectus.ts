import { ProspectusFund, StageDefinition } from '../types';
import seatImg from '../assets/images/tmf_genesis_seat_1791574590030.jpg';
import briefcaseImg from '../assets/images/tmf_briefcase_vault_1791574601228.jpg';
import fundsImg from '../assets/images/tmf_five_funds_board_1791574612776.jpg';
import votingImg from '../assets/images/tmf_voting_ballot_1791574624509.jpg';
import galaxyImg from '../assets/images/tmf_seats_galaxy_1791574636547.jpg';

export const ART_ASSETS = {
  seat: seatImg,
  briefcase: briefcaseImg,
  funds: fundsImg,
  voting: votingImg,
  galaxy: galaxyImg,
};

export const INFINITE_ZOOM_LAYERS = [
  {
    id: 'genesis_office',
    title: 'THE CORNER OFFICE',
    subtitle: 'Genesis of The Mutual Fun',
    image: seatImg,
    range: [0.00, 0.22] as [number, number],
    portal: { x: 0.35, y: 0.38 }, // The CRT monitor on the desk
    prospectusTopic: 'Every Seat belongs to one fund. 64x64 on-chain pixel portrait.',
  },
  {
    id: 'briefcase_vault',
    title: 'THE ON-CHAIN BRIEFCASE',
    subtitle: 'Autonomous Dividend Vault',
    image: briefcaseImg,
    range: [0.22, 0.44] as [number, number],
    portal: { x: 0.50, y: 0.52 }, // The golden latch lock
    prospectusTopic: 'Cashed dividends collect here. The briefcase travels with the Seat.',
  },
  {
    id: 'five_funds',
    title: 'THE FIVE FUNDS COUNCIL',
    subtitle: 'Argon · Bogle · Smaug · Midas · Vladd',
    image: fundsImg,
    range: [0.44, 0.64] as [number, number],
    portal: { x: 0.50, y: 0.74 }, // The round table center
    prospectusTopic: 'Five funds begin identical. They diverge through member voting.',
  },
  {
    id: 'voting_terminal',
    title: 'GOVERNANCE & WEEK 13',
    subtitle: 'Weekly Voting & Continuation Mandate',
    image: votingImg,
    range: [0.64, 0.84] as [number, number],
    portal: { x: 0.30, y: 0.42 }, // The golden Week 13 Continuation Seal
    prospectusTopic: 'Members vote weekly. Every 13th week, vote whether the fund continues.',
  },
  {
    id: 'seats_galaxy',
    title: '4,001 SEATS GALAXY',
    subtitle: 'Autonomous On-Chain Cosmos',
    image: galaxyImg,
    range: [0.84, 1.00] as [number, number],
    portal: { x: 0.50, y: 0.50 }, // The central golden Chairman Seat 0
    prospectusTopic: '4,001 Seats. Nobody holds the keys. Stop trading alone.',
  },
];

export const PROSPECTUS_CONTENT = {
  summary: {
    totalSeats: 4001,
    fundSeats: 4000,
    specialSeats: 1, // Seat 0
    fundsCount: 5,
    tokenSupply: '1,604,401,000',
    tokensPerSeat: '401,000',
    tagline: 'STOP TRADING ALONE.',
  },

  pixel: {
    title: 'THE VOID',
    concept: 'At the atomic center sits one on-chain unit.',
    scrollHint: 'SCROLL TO EXPLORE ↓',
  },

  seat: {
    title: 'THE SEAT',
    resolution: '64 × 64',
    artDescription: '64×64 on-chain pixel portrait stored directly on the blockchain.',
    uniquePortraits: 11,
    rarityNote: 'The chair is the main rarity trait.',
    markers: [
      {
        id: 'art',
        label: 'ART',
        title: '64×64 Pixel Portrait',
        text: '64×64 on-chain pixel portrait stored directly on-chain.',
        x: 18,
        y: 28,
      },
      {
        id: 'fund',
        label: 'FUND',
        title: 'Fund Membership',
        text: 'Your Seat belongs to one of five funds.',
        x: 82,
        y: 28,
      },
      {
        id: 'vote',
        label: 'VOTE',
        title: 'Weekly Governance',
        text: 'Vote weekly on how the fund invests.',
        x: 14,
        y: 72,
      },
      {
        id: 'continuation',
        label: 'CONTINUATION',
        title: '13-Week Horizon',
        text: 'Every 13th week, members vote on whether the fund continues.',
        x: 86,
        y: 72,
      },
      {
        id: 'briefcase',
        label: 'BRIEFCASE',
        title: 'On-Chain Vault',
        text: 'An on-chain Briefcase belongs to the Seat.',
        x: 50,
        y: 88,
      },
    ],
  },

  systemComponents: [
    { title: 'PORTRAIT', desc: '64×64 pixel portrait stored on-chain' },
    { title: 'FUND CLAIM', desc: 'Direct membership in 1 of 5 funds' },
    { title: 'WEEKLY VOTE', desc: 'Governs fund investment actions' },
    { title: 'CONTINUATION VOTE', desc: 'Quarterly continuation mandate' },
    { title: 'BRIEFCASE', desc: 'Autonomous on-chain dividend receiver' },
  ],

  briefcase: {
    title: 'THE BRIEFCASE',
    kicker: 'ON-CHAIN VAULT',
    headline: 'CASHED DIVIDENDS COLLECT HERE.',
    subtext: 'The Briefcase is on-chain. It travels with the Seat.',
    transferMechanism: 'WALLET A → SEAT → WALLET B',
    paymentRule: "Its balance becomes part of the buyer's payment.",
  },

  funds: [
    {
      id: 'argon',
      name: 'ARGON',
      description: 'First fund division. 800 member seats.',
      seats: 800,
      color: '#60a5fa', // Blue accent
      accent: 'rgb(96, 165, 250)',
    },
    {
      id: 'bogle',
      name: 'BOGLE',
      description: 'Second fund division. 800 member seats.',
      seats: 800,
      color: '#34d399', // Emerald accent
      accent: 'rgb(52, 211, 153)',
    },
    {
      id: 'smaug',
      name: 'SMAUG',
      description: 'Third fund division. 800 member seats.',
      seats: 800,
      color: '#f87171', // Red accent
      accent: 'rgb(248, 113, 113)',
    },
    {
      id: 'midas',
      name: 'MIDAS',
      description: 'Fourth fund division. 800 member seats.',
      seats: 800,
      color: '#fbbf24', // Amber/gold accent
      accent: 'rgb(251, 191, 36)',
    },
    {
      id: 'vladd',
      name: 'VLADD',
      description: 'Fifth fund division. 800 member seats.',
      seats: 800,
      color: '#a78bfa', // Purple accent
      accent: 'rgb(167, 139, 250)',
    },
  ] as ProspectusFund[],

  voting: {
    headline: 'WEEKLY VOTE',
    explanation: 'Members vote weekly on how their fund invests.',
    cycleLengthWeeks: 13,
  },

  continuation: {
    headline: 'WEEK 13: CONTINUATION VOTE',
    explanation: 'Every 13th week, members decide whether the fund continues.',
    subtext: 'The fundamental mandate renewed every quarter by member consensus.',
  },

  enrollment: {
    premise: 'HOLDING A SEAT EARNS NOTHING.',
    action: 'ENROLL',
    frontEndLoad: 'One-time front-end load paid in $TMF',
    split: {
      burnedPct: 50,
      fundPct: 50,
    },
    rule: 'Enrollment ends when the Seat changes hands.',
  },

  openMarket: {
    headline: 'OPEN MARKET',
    subtext: 'The till backs buybacks.',
    paths: [
      {
        label: 'RANDOM CHAIR',
        price: '401k + 8%',
        desc: 'Acquire an unassigned Seat drawn from the fund till.',
      },
      {
        label: 'SPECIFIC CHAIR',
        price: '401k + 16%',
        desc: 'Target and purchase a specific selected Seat ID.',
      },
      {
        label: 'SELL',
        price: '401k − 8%',
        desc: 'Return the Seat to the till for instantaneous liquidity.',
      },
    ],
  },

  token: {
    ticker: '$TMF',
    totalSupply: '1,604,401,000',
    allocationPerSeat: '401,000 $TMF per Seat',
    seatsBase: '4,001 Seats',
    mintSchedule: 'MINTED ONCE',
    teamAllocation: 'NO TEAM ALLOCATION',
  },

  mAndA: {
    headline: 'MERGERS & ACQUISITIONS',
    process: 'SEAT + SEAT → MERGE → ONE SEAT',
    rule: 'Two enrolled Seats in the same fund and class can merge into one Seat a class higher.',
    effect1: 'Supply gets smaller.',
    effect2: "The retired chair's checks transfer.",
    outcome: 'CORNER OFFICE',
  },

  allSeats: {
    headline: '4,001 SEATS',
    breakdown: '800 × 5 Funds + Seat 0',
    allocation: [
      { fund: 'ARGON', count: 800 },
      { fund: 'BOGLE', count: 800 },
      { fund: 'SMAUG', count: 800 },
      { fund: 'MIDAS', count: 800 },
      { fund: 'VLADD', count: 800 },
      { fund: 'CHAIRMAN', count: 1, note: 'Seat 0' },
    ],
  },

  systemMap: {
    title: 'THE SEAT CYCLE',
    steps: [
      { id: 'seat', label: 'SEAT', desc: 'On-chain NFT membership token' },
      { id: 'enroll', label: 'ENROLL', desc: 'Load fee: 50% burned, 50% fund' },
      { id: 'vote', label: 'VOTE', desc: 'Weekly investment policy votes' },
      { id: 'fund', label: 'FUND', desc: 'Executes community investment strategy' },
      { id: 'dividends', label: 'DIVIDENDS', desc: 'Cashed returns distributed to members' },
      { id: 'briefcase', label: 'BRIEFCASE', desc: 'On-chain vault carries collected value' },
    ],
  },

  nobodyHoldsTheKeys: {
    question: 'SO WHO CONTROLS IT?',
    answer: 'NOBODY HOLDS THE KEYS.',
    tenets: [
      { title: 'NO OWNER', desc: 'Zero administrative privileges or master key' },
      { title: 'NO UPGRADE MECHANISM', desc: 'Immutable verified on-chain smart contracts' },
      { title: 'NO PAUSE SWITCH', desc: 'Cannot be halted, frozen, or censored' },
    ],
    operational: [
      'Routine functions can be called by anyone.',
      'Everything else runs automatically.',
    ],
  },

  finalReveal: {
    title: 'THE MUTUAL FUN',
    stats: [
      '4,001 SEATS',
      '5 FUNDS',
      'WEEKLY MEMBER VOTING',
      'ON-CHAIN BRIEFCASES',
    ],
    callToAction: 'STOP TRADING ALONE.',
  },
};

// Continuous Camera Stages Mapped from 0.00 to 1.00
export const STAGES: StageDefinition[] = [
  {
    id: 'void',
    num: '00',
    title: 'THE VOID',
    range: [0.00, 0.07],
    kicker: 'GENESIS',
    headline: 'THE MUTUAL FUN',
    explanation: 'At the atomic center sits one on-chain unit.',
    subtext: 'SCROLL TO EXPLORE ↓',
  },
  {
    id: 'seat',
    num: '01',
    title: 'THE SEAT',
    range: [0.07, 0.15],
    kicker: 'MEMBERSHIP TOKEN',
    headline: 'EVERY SEAT BELONGS TO ONE FUND.',
    explanation: '4,001 on-chain Seats forming the governance of The Mutual Fun.',
    subtext: 'Hover interactive markers to inspect key properties.',
  },
  {
    id: 'art',
    num: '02',
    title: 'ON-CHAIN PORTRAIT',
    range: [0.15, 0.22],
    kicker: '64 × 64 PIXELS',
    headline: '11 UNIQUE PORTRAITS',
    explanation: "The Seat's artwork is a 64×64 pixel portrait stored on-chain.",
    subtext: 'The chair is the main rarity trait.',
  },
  {
    id: 'system',
    num: '03',
    title: 'THE SEAT AS A SYSTEM',
    range: [0.22, 0.29],
    kicker: 'ARCHITECTURE',
    headline: 'THE ART IS ONLY ONE PART.',
    explanation: 'The Seat connects art, membership, voting and a briefcase.',
    subtext: 'Five integrated vectors bound to a single token.',
  },
  {
    id: 'briefcase',
    num: '04',
    title: 'THE BRIEFCASE',
    range: [0.29, 0.38],
    kicker: 'ON-CHAIN VAULT',
    headline: 'CASHED DIVIDENDS COLLECT HERE.',
    explanation: 'The Briefcase is on-chain. It travels with the Seat.',
    subtext: "Its balance becomes part of the buyer's payment.",
  },
  {
    id: 'funds',
    num: '05',
    title: 'FIVE FUNDS',
    range: [0.38, 0.46],
    kicker: 'ONE SEAT ↓ ONE FUND',
    headline: 'ARGON · BOGLE · SMAUG · MIDAS · VLADD',
    explanation: 'Five funds begin with the same structure. They differ through member decisions.',
    subtext: 'Each fund operates with 800 autonomous Seats.',
  },
  {
    id: 'voting',
    num: '06',
    title: 'WEEKLY VOTING',
    range: [0.46, 0.53],
    kicker: 'GOVERNANCE',
    headline: 'WEEKLY VOTE',
    explanation: 'Members vote weekly on how their fund invests.',
    subtext: 'Continuous collective portfolio strategy through on-chain ballots.',
  },
  {
    id: 'continuation',
    num: '07',
    title: 'CONTINUATION',
    range: [0.53, 0.60],
    kicker: 'QUARTERLY MANDATE',
    headline: 'WEEK 13: CONTINUATION VOTE',
    explanation: 'Every 13th week, members decide whether the fund continues.',
    subtext: 'Quarterly consensus maintains or dissolves fund life.',
  },
  {
    id: 'enrollment',
    num: '08',
    title: 'ENROLLMENT',
    range: [0.60, 0.67],
    kicker: 'ACTIVATION',
    headline: 'HOLDING A SEAT EARNS NOTHING.',
    explanation: 'Enroll with a one-time front-end load: 50% burned, 50% to the fund.',
    subtext: 'Enrollment ends when the Seat changes hands.',
  },
  {
    id: 'openmarket',
    num: '09',
    title: 'OPEN MARKET',
    range: [0.67, 0.74],
    kicker: 'LIQUIDITY',
    headline: 'THE TILL BACKS BUYBACKS.',
    explanation: 'Instantaneous liquidity backed directly by smart contract reserves.',
    subtext: 'Random Chair (401k + 8%) · Specific Chair (401k + 16%) · Sell (401k − 8%)',
  },
  {
    id: 'token',
    num: '10',
    title: '$TMF TOKEN',
    range: [0.74, 0.81],
    kicker: 'FIXED SUPPLY',
    headline: '1,604,401,000 $TMF',
    explanation: '401k per 4,001 Seat. Minted once. No team allocation.',
    subtext: 'Immutable distribution bound directly to Seat genesis.',
  },
  {
    id: 'manda',
    num: '11',
    title: 'M&A',
    range: [0.81, 0.87],
    kicker: 'CONSOLIDATION',
    headline: 'SEAT + SEAT → MERGE → ONE SEAT',
    explanation: 'Two enrolled Seats in the same fund and class merge into one Seat a class higher.',
    subtext: "Supply gets smaller. The retired chair's checks transfer. Resulting Seat: Corner Office.",
  },
  {
    id: 'seatfield',
    num: '12',
    title: '4,001 SEATS',
    range: [0.87, 0.93],
    kicker: 'THE NETWORK',
    headline: '4,001 ON-CHAIN SEATS',
    explanation: '800 Argon · 800 Bogle · 800 Smaug · 800 Midas · 800 Vladd + Seat 0.',
    subtext: 'Hover individual fund clusters to highlight member constellations.',
  },
  {
    id: 'systemmap',
    num: '13',
    title: 'THE SYSTEM',
    range: [0.93, 0.965],
    kicker: 'CIRCULAR ARCHITECTURE',
    headline: 'THE SEAT CYCLE',
    explanation: 'Seat → Enroll → Vote → Fund → Dividends → Briefcase → Seat.',
    subtext: 'How the autonomous economic pieces connect.',
  },
  {
    id: 'nobody',
    num: '14',
    title: 'AUTONOMY',
    range: [0.965, 0.985],
    kicker: 'SO WHO CONTROLS IT?',
    headline: 'NOBODY HOLDS THE KEYS.',
    explanation: 'No owner. No upgrade mechanism. No pause switch.',
    subtext: 'Routine functions can be called by anyone. Everything else runs automatically.',
  },
  {
    id: 'final',
    num: '15',
    title: 'THE MUTUAL FUN',
    range: [0.985, 1.00],
    kicker: 'A NEW FINANCIAL SPECIES',
    headline: 'THE MUTUAL FUN',
    explanation: '4,001 Seats. 5 Funds. Weekly Member Voting. On-Chain Briefcases.',
    subtext: 'STOP TRADING ALONE.',
  },
];
