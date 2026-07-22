// src/app/(services)/bracketService.ts

export type BracketType = "SingleEliminationBracket" | "DoubleEliminationBracket" | "roundrobin";

export interface Participant {
  id: string;
  resultText?: string;
  isWinner?: boolean;
  status?: "PLAYED" | "NO_SHOW" | "WALK_OVER" | "NO_PARTY";
  name: string;
}

export interface Match {
  id: number | string;
  nextMatchId?: number | string;
  tournamentRoundText?: string;
  seriesText?: string | null;
  startTime?: string;
  state: "DONE" | "SCHEDULED" | "WALK_OVER" | "NO_SHOW";
  participants: Participant[];
}

export interface BracketData {
  type: BracketType;
  matches?: Match[];
  upperMatches?: Match[];
  lowerMatches?: Match[];
  standings?: any[]; // For round robin
}

const MOCK_SINGLE_ELIMINATION: any[] = [
  {
    id: 260005,
    name: 'Final - Match',
    nextMatchId: null,
    nextLooserMatchId: null,
    tournamentRoundText: '4',
    startTime: '2021-05-30',
    state: 'SCHEDULED',
    participants: [
      {
        id: 'c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'giacomo123',
      },
      {
        id: '9ea9ce1a-4794-4553-856c-9a3620c0531b',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'Ant',
      },
    ],
  },
  {
    id: 260006,
    name: 'Semi Final - Match 1',
    nextMatchId: 260005,
    nextLooserMatchId: null,
    tournamentRoundText: '3',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: 'c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc',
        resultText: '1',
        isWinner: true,
        status: 'PLAYED',
        name: 'giacomo123',
      },
      {
        id: '008de019-4af6-4178-a042-936c33fea3e9',
        resultText: '0',
        isWinner: false,
        status: 'PLAYED',
        name: 'TowbyTest',
      },
    ],
  },
  {
    id: 260013,
    name: 'Semi Final - Match 2',
    nextMatchId: 260005,
    nextLooserMatchId: null,
    tournamentRoundText: '3',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '9c92feb3-4aa4-4475-a34e-f9a200e21aa9',
        resultText: null,
        isWinner: false,
        status: 'NO_SHOW',
        name: 'WubbaLubbaDubbish',
      },
      {
        id: '9ea9ce1a-4794-4553-856c-9a3620c0531b',
        resultText: null,
        isWinner: true,
        status: 'WALK_OVER',
      },
    ],
  },
  {
    id: 260007,
    name: 'Round 2 - Match 1',
    nextMatchId: 260006,
    nextLooserMatchId: null,
    tournamentRoundText: '2',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '1ec356ec-a7c4-4026-929b-3657286a92d8',
        resultText: '0',
        isWinner: false,
        status: 'PLAYED',
        name: 'TestSpectacles',
      },
      {
        id: 'c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc',
        resultText: '0',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 260010,
    name: 'Round 2 - Match 2',
    nextMatchId: 260006,
    nextLooserMatchId: null,
    tournamentRoundText: '2',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: 'c2f551b4-2d5a-4c59-86a8-df575805256a',
        resultText: '0',
        isWinner: false,
        status: 'PLAYED',
        name: 'Ahshitherewegoagain',
      },
      {
        id: '008de019-4af6-4178-a042-936c33fea3e9',
        resultText: '1',
        isWinner: true,
        status: 'PLAYED',
      },
    ],
  },
  {
    id: 260014,
    name: 'Round 2 - Match 3',
    nextMatchId: 260013,
    nextLooserMatchId: null,
    tournamentRoundText: '2',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '9c92feb3-4aa4-4475-a34e-f9a200e21aa9',
        resultText: '1',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '4651dcd0-853e-4242-9924-602e8200dd17',
        resultText: '0',
        isWinner: false,
        status: 'PLAYED',
        name: 'FIFA_MASTER',
      },
    ],
  },
  {
    id: 260017,
    name: 'Round 2 - Match 4',
    nextMatchId: 260013,
    nextLooserMatchId: null,
    tournamentRoundText: '2',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '9ea9ce1a-4794-4553-856c-9a3620c0531b',
        resultText: '1',
        isWinner: true,
        status: 'PLAYED',
      },
      {
        id: '76ac9113-a541-4b6a-a189-7b5ad43729bd',
        resultText: '0',
        isWinner: false,
        status: 'PLAYED',
        name: 'رئيس',
      },
    ],
  },
  {
    id: 260011,
    name: 'Round 1 - Match 3',
    nextMatchId: 260010,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: 'c2f551b4-2d5a-4c59-86a8-df575805256a',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
  {
    id: 260009,
    name: 'Round 1 - Match 2',
    nextMatchId: 260007,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: '1ec356ec-a7c4-4026-929b-3657286a92d8',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
  {
    id: 260008,
    name: 'Round 1 - Match 1',
    nextMatchId: 260007,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: '2021-05-30',
    state: 'SCORE_DONE',
    participants: [
      {
        id: 'c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc',
        resultText: '1',
        isWinner: true,
        status: 'PLAYED',
        name: 'giacomo123',
      },
      {
        id: '4831deb3-969b-49e1-944e-3ad886e6dd6c',
        resultText: '0',
        isWinner: false,
        status: 'PLAYED',
        name: 'ZoeZ',
      },
    ],
  },
  {
    id: 260015,
    name: 'Round 1 - Match 5',
    nextMatchId: 260014,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: '9c92feb3-4aa4-4475-a34e-f9a200e21aa9',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
  {
    id: 260012,
    name: 'Round 1 - Match 4',
    nextMatchId: 260010,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: '008de019-4af6-4178-a042-936c33fea3e9',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
  {
    id: 260019,
    name: 'Round 1 - Match 8',
    nextMatchId: 260017,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: '76ac9113-a541-4b6a-a189-7b5ad43729bd',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
  {
    id: 260018,
    name: 'Round 1 - Match 7',
    nextMatchId: 260017,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: '9ea9ce1a-4794-4553-856c-9a3620c0531b',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
  {
    id: 260016,
    name: 'Round 1 - Match 6',
    nextMatchId: 260014,
    nextLooserMatchId: null,
    tournamentRoundText: '1',
    startTime: null,
    state: 'WALK_OVER',
    participants: [
      {
        id: '4651dcd0-853e-4242-9924-602e8200dd17',
        resultText: null,
        isWinner: false,
        status: null,
      },
    ],
  },
];

const MOCK_DOUBLE_DATA = {
  upper: [
    {
      id: 20231,
      name: 'UB 1.10',
      nextMatchId: 20242,
      nextLooserMatchId: 20257,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: '5a2188a4-5e8b-4489-96ba-0140b4342cfd',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20232,
      name: 'UB 2.8',
      nextMatchId: 20210,
      nextLooserMatchId: 20217,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20233,
      name: 'UB 2.7',
      nextMatchId: 20210,
      nextLooserMatchId: 20220,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '8cfbe1b3-090e-4665-82bb-aff37bebb6f4',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20234,
      name: 'UB 2.4',
      nextMatchId: 20207,
      nextLooserMatchId: 20221,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '2ff0c36b-3acc-4c21-90c4-6eeec34e7828',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20235,
      name: 'UB 4.2',
      nextMatchId: 20214,
      nextLooserMatchId: 20223,
      tournamentRoundText: 'UB 4',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20236,
      name: 'UB 1.14',
      nextMatchId: 20233,
      nextLooserMatchId: 20261,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: '8cfbe1b3-090e-4665-82bb-aff37bebb6f4',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20237,
      name: 'UB 4.1',
      nextMatchId: 20214,
      nextLooserMatchId: 20229,
      tournamentRoundText: 'UB 4',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20238,
      name: 'UB 2.3',
      nextMatchId: 20207,
      nextLooserMatchId: 20227,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '781e48d6-2c4d-496d-92e8-6385ea9a7782',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20239,
      name: 'UB 1.13',
      nextMatchId: 20233,
      nextLooserMatchId: 20261,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: 'c08a1b93-ada2-45b2-8825-f268f167b040',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: 'b5cd08d2-1596-4c08-9851-75b4f4de7f60',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20240,
      name: 'UB 2.6',
      nextMatchId: 20205,
      nextLooserMatchId: 20218,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20241,
      name: 'UB 1.12',
      nextMatchId: 20240,
      nextLooserMatchId: 20254,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '0ea06043-7293-4fff-a147-9e47514b6156',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: '3f7494da-29bb-4594-8a29-7a73080521b5',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20242,
      name: 'UB 2.5',
      nextMatchId: 20205,
      nextLooserMatchId: 20224,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '5a2188a4-5e8b-4489-96ba-0140b4342cfd',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20243,
      name: 'UB 1.11',
      nextMatchId: 20240,
      nextLooserMatchId: 20254,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: 'a601f9ee-1efd-4542-94ab-e62beb690884',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: '0df5a720-27cd-4ab7-a9b2-1682ac4efe3d',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20244,
      name: 'UB 2.2',
      nextMatchId: 20212,
      nextLooserMatchId: 20226,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: 'ea7cc04f-aa82-4072-a7c8-397ea3badd6b',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: '6a602af0-5425-46fd-a3eb-f4d4559717d4',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20245,
      name: 'UB 1.16',
      nextMatchId: 20232,
      nextLooserMatchId: 20260,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: 'd9edef7d-747f-4516-8dc0-667a2d923785',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: 'c3116829-63bf-4dfb-8b77-9925eea7a988',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20246,
      name: 'UB 2.1',
      nextMatchId: 20212,
      nextLooserMatchId: 20230,
      tournamentRoundText: 'UB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '59c63115-d023-46b7-803b-c95d2b03c802',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: 'ea43f65a-81ab-4aea-a945-c7bda5ce87e6',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20247,
      name: 'UB 1.15',
      nextMatchId: 20232,
      nextLooserMatchId: 20260,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '61da8bf1-9e6f-4435-b8f5-662c3e28b771',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: 'e37b4d05-d5c6-4561-bac6-9c8c9a0611cd',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20263,
      name: 'Final',
      nextMatchId: null,
      nextLooserMatchId: null,
      tournamentRoundText: 'UB 6',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20202,
      name: 'UB 1.9',
      nextMatchId: 20242,
      nextLooserMatchId: 20257,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '6c16a503-6577-4f67-9264-935b4dcd5247',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: '2f9dddd8-eb61-4d73-a34b-a5ba7c6c8311',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20203,
      name: 'UB 1.8',
      nextMatchId: 20234,
      nextLooserMatchId: 20250,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '8d4037de-aeb0-4c04-a0b4-868560561d78',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: '827f34e6-9964-4038-b4a4-663016f18f02',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20204,
      name: 'UB 1.5',
      nextMatchId: 20238,
      nextLooserMatchId: 20252,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        {
          id: '0b2ce314-e4ed-4abf-9050-69d51a45e0d7',
          resultText: null,
          isWinner: false,
          status: null,
        },
        {
          id: '7c44871a-fbdd-4861-a690-600ddb427d51',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20205,
      name: 'UB 3.3',
      nextMatchId: 20235,
      nextLooserMatchId: 20222,
      tournamentRoundText: 'UB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20206,
      name: 'UB 1.4',
      nextMatchId: 20244,
      nextLooserMatchId: 20248,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: '6a602af0-5425-46fd-a3eb-f4d4559717d4',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20207,
      name: 'UB 3.2',
      nextMatchId: 20237,
      nextLooserMatchId: 20225,
      tournamentRoundText: 'UB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20208,
      name: 'UB 1.7',
      nextMatchId: 20234,
      nextLooserMatchId: 20250,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: '2ff0c36b-3acc-4c21-90c4-6eeec34e7828',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20209,
      name: 'UB 1.6',
      nextMatchId: 20238,
      nextLooserMatchId: 20252,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: '781e48d6-2c4d-496d-92e8-6385ea9a7782',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20210,
      name: 'UB 3.4',
      nextMatchId: 20235,
      nextLooserMatchId: 20228,
      tournamentRoundText: 'UB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20211,
      name: 'UB 1.1',
      nextMatchId: 20246,
      nextLooserMatchId: 20249,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: '59c63115-d023-46b7-803b-c95d2b03c802',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20212,
      name: 'UB 3.1',
      nextMatchId: 20237,
      nextLooserMatchId: 20219,
      tournamentRoundText: 'UB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20213,
      name: 'UB 1.3',
      nextMatchId: 20244,
      nextLooserMatchId: 20248,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: 'ea7cc04f-aa82-4072-a7c8-397ea3badd6b',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
    {
      id: 20214,
      name: 'UB Semi Final',
      nextMatchId: 20263,
      nextLooserMatchId: 20216,
      tournamentRoundText: 'UB 5',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20215,
      name: 'UB 1.2',
      nextMatchId: 20246,
      nextLooserMatchId: 20249,
      tournamentRoundText: 'UB 1',
      startTime: null,
      state: 'WALK_OVER',
      participants: [
        {
          id: 'ea43f65a-81ab-4aea-a945-c7bda5ce87e6',
          resultText: null,
          isWinner: false,
          status: null,
        },
      ],
    },
  ],
  lower: [
    {
      id: 20224,
      name: 'LB 2.4',
      nextMatchId: 20251,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20225,
      name: 'LB 4.2',
      nextMatchId: 20259,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 4',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20226,
      name: 'LB 2.7',
      nextMatchId: 20255,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20227,
      name: 'LB 2.6',
      nextMatchId: 20258,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20228,
      name: 'LB 4.4',
      nextMatchId: 20256,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 4',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20229,
      name: 'LB 6.2',
      nextMatchId: 20262,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 6',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20230,
      name: 'LB 2.8',
      nextMatchId: 20255,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20248,
      name: 'LB 1.2',
      nextMatchId: 20220,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
      ],
    },
    {
      id: 20249,
      name: 'LB 1.1',
      nextMatchId: 20217,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
      ],
    },
    {
      id: 20250,
      name: 'LB 1.4',
      nextMatchId: 20224,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
      ],
    },
    {
      id: 20251,
      name: 'LB 3.2',
      nextMatchId: 20225,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20252,
      name: 'LB 1.3',
      nextMatchId: 20218,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
      ],
    },
    {
      id: 20253,
      name: 'LB 3.1',
      nextMatchId: 20219,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20254,
      name: 'LB 1.6',
      nextMatchId: 20227,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20255,
      name: 'LB 3.4',
      nextMatchId: 20228,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20256,
      name: 'LB 5.2',
      nextMatchId: 20229,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 5',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20257,
      name: 'LB 1.5',
      nextMatchId: 20221,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
      ],
    },
    {
      id: 20258,
      name: 'LB 3.3',
      nextMatchId: 20222,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 3',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20259,
      name: 'LB 5.1',
      nextMatchId: 20223,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 5',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20260,
      name: 'LB 1.8',
      nextMatchId: 20230,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20261,
      name: 'LB 1.7',
      nextMatchId: 20226,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 1',
      startTime: null,
      state: 'SCHEDULED',
      participants: [
        { id: null, resultText: null, isWinner: false, status: 'NO_PARTY' },
      ],
    },
    {
      id: 20262,
      name: 'LB 7.1',
      nextMatchId: 20216,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 7',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20216,
      name: 'LB Semi Final',
      nextMatchId: 20263,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 8',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20217,
      name: 'LB 2.1',
      nextMatchId: 20253,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20218,
      name: 'LB 2.3',
      nextMatchId: 20251,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20219,
      name: 'LB 4.1',
      nextMatchId: 20259,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 4',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20220,
      name: 'LB 2.2',
      nextMatchId: 20253,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20221,
      name: 'LB 2.5',
      nextMatchId: 20258,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 2',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20222,
      name: 'LB 4.3',
      nextMatchId: 20256,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 4',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
    {
      id: 20223,
      name: 'LB 6.1',
      nextMatchId: 20262,
      nextLooserMatchId: null,
      tournamentRoundText: 'LB 6',
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
    },
  ],
};

/**
 * Normalizes whatever your API returns into the BracketData shape.
 * Extend this function as you learn your API's response structure.
 */
function normalizeApiResponse(raw: any, tournamentId: string): BracketData | null {
  if (!raw) return null;

  // ── Format A: API already returns { type, matches } ──────────────────────
  if (raw.type && raw.matches) {
    return raw as BracketData;
  }

  // ── Format B: API returns { bracketType, rounds: [{ round, matches[] }] } ─
  if (raw.bracketType && Array.isArray(raw.rounds)) {
    const matches: Match[] = [];
    raw.rounds.forEach((round: any, rIdx: number) => {
      (round.matches || []).forEach((m: any) => {
        // Opponents can live in opponents[], teams[], players[], or participants[]
        const rawParticipants = m.opponents || m.teams || m.players || m.participants || [];
        matches.push({
          id: m._id || m.id || `${rIdx}-${Math.random()}`,
          nextMatchId: m.nextMatchId ?? null,
          tournamentRoundText: round.name || round.title || `Round ${round.round || rIdx + 1}`,
          seriesText: round.series || m.series || null,
          startTime: m.startTime || m.scheduledAt || "",
          state: (["completed", "done", "finished", "score_done", "walk_over"].includes(
            (m.status || m.state || "").toLowerCase()
          ) ? (m.status || m.state || "").toUpperCase().replace(/ /g,"_") : "SCHEDULED") as any,
          participants: rawParticipants.map((p: any, idx: number) => ({
            id: p.competitor?._id || p._id || p.id || `${m._id || m.id}-p${idx}`,
            name:
              p.competitor?.username ||
              p.username ||
              p.name ||
              p.teamName ||
              p.source ||
              "TBD",
            resultText: p.score != null ? String(p.score) : null,
            isWinner: p.result === "win" || !!p.isWinner || !!p.winner,
            status: p.status || null,
          })),
        });
      });
    });
    const bracketTypeStr = (raw.bracketType || "").toLowerCase();
    return {
      type: bracketTypeStr.includes("double") ? "DoubleEliminationBracket"
           : bracketTypeStr.includes("round") ? "roundrobin"
           : "SingleEliminationBracket",
      matches,
    };
  }

  // ── Format C: API returns a flat array of matches or rounds ────────────────
  if (Array.isArray(raw)) {
    return raw as any; // Pass the array directly to the adapter
  }

  // Unknown format — log and return null so UI shows fallback
  console.warn("[bracketService] Unknown API response format for tournament:", tournamentId, raw);
  return null;
}

export const bracketService = {
  async getBracketsByTournamentId(tournamentId: string, formatHint?: string): Promise<BracketData | null> {
    try {
      // ── Real API call ──────────────────────────────────────────────────────
      // Replace the URL below with your actual bracket API endpoint.
      // The response is normalized by normalizeApiResponse() above.
      const API_URL = `https://apis.xesports.pro/v1/bracket/${tournamentId}`;
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const raw = await res.json();
        console.log("Bracket API Response:", raw);
        const normalized = normalizeApiResponse(raw, tournamentId);
        console.log("Bracket API Normalized Response:", normalized);
        if (normalized) return normalized;
        // If normalizer returned null, fall through to mock data
      }
    } catch (err) {
      // Network error or API not yet live — fall through to mock data
      console.info("[bracketService] API not available, using demo data:", err);
    }

    // ── Fallback: demo data (used when API returns nothing or errors) ────────
    // Detect double elimination from ID or Format Hint
    const isDouble = tournamentId.toLowerCase().includes('double') || 
                    (formatHint?.toLowerCase().includes('double'));

    if (isDouble) {
      return {
        type: "DoubleEliminationBracket",
        upperMatches: MOCK_DOUBLE_DATA.upper as any,
        lowerMatches: MOCK_DOUBLE_DATA.lower as any,
      };
    }

    return {
      type: "SingleEliminationBracket",
      matches: MOCK_SINGLE_ELIMINATION,
    };
  },
};
