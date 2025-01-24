export const TITLE_PAGE_CONTENTS = {
  HELP_BUTTON: {
    title: 'Guide',
    imageSrc: './assets/content/aisleA.jpg',
    facts: [
      'Use WASD keys to move around.',
      'Use E key to interact with interactable objects and NPCS',
      'Use up arrow and down arrow to select dialogue options',
      'Press enter to choose response',
      'Discover 12 secrets to unlock a hidden level!'
    ]
  },
  COUNTRY_DETAILS: {
    Australia: {
      title: 'Australia',
      text: 'I live in Sydney, and I study Computer Science at UNSW.',
      image: './assets/flags/Australia.png'
    },
    China: {
      title: 'China',
      text: 'I\'m learning Mandarin and love Chinese cuisine like dumplings and hotpot.',
      image: './assets/flags/China.png'
    },
    America: {
      title: 'America',
      text: 'I\'ve always admired Silicon Valley and the tech scene in the US!',
      image: './assets/flags/America.png'
    },
    Korea: {
      title: 'Korea',
      text: 'Kdrama!',
      image: './assets/flags/Korea.png'
    },
    Philippines: {
      title: 'Philippines',
      text: 'I\'m filo lol',
      image: './assets/flags/Philippines.png'
    }
  },
  INTRO_MESSAGE: 'Welcome aboard! This is Carlson\'s "about me" portfolio.' +
                 'Carlson has suddenly disappeared and we need to find him' +
                 'now! We need your help! After this interaction you will be' +
                 'taken to the title page in which you will find 3 buttons:' +
                 'start, Where was Carlson Last Seen and ?. Do you have any' +
                 'questions?',
  INTRO_MESSAGE_OPTION1: [
    'What is the start button?',
    'What is the "Where was Carlson last seen" button?',
    'What is the "?" button?',
    'Continue'
  ],
  INTRO_MESSAGE_OPTION_START: [
    'What is the "Where was Carlson last seen" button?',
    'What is the "?" button?',
    'Continue'
  ],
  INTRO_MESSAGE_OPTION_LAST_SEEN: [
    'What is the start button?',
    'What is the "?" button?',
    'Continue'
  ],
  INTRO_MESSAGE_OPTION_HELP: [
    'What is the start button?',
    'What is the "Where was Carlson last seen" button?',
    'Continue'
  ],
  INTRO_MESSAGE1: 'The start button will commence the game and you will be' +
                  'required to find Carlson. There\'ll be secrets to uncover' +
                  'about Carlson which will help you find his location!',
  INTRO_MESSAGE2: 'The "Where was Carlson last seen" button will provide' +
                  'hints about Carlson\'s personality which may help you find' +
                  'his location! There is also a danger button which is for' +
                  'those who are unwilling to play the game and just want' +
                  'Carlson\'s about me portfolio.',
  INTRO_MESSAGE3: 'The "?" button provides help and guidance about the game,' +
                  'offering tips and explaining the rules to enhance your' +
                  'experience.',
  INTRO_MESSAGE4: 'Good luck with the game! Let the adventure begin!'
};

export const TILES = {
  CARPET: {
    A: -101,
    B: -102,
    C: -103,
    D: -104,
    E: -105,
    F: -106,
    G: -107,
    H: -108,
    I: -109,
    J: -110,
    K: -111,
    L: -112,
  },
  ROW: {
    A: 201,
    B: 202,
    C: 203,
    D: 204,
    E: 205,
    F: 206,
    G: 207,
    H: 208,
    I: 209,
    J: 210,
    K: 211,
    L: 212,
  },
  PLAYER: -21,
  FLOOR: -1,
  NOTHING: 0,
  WALL: 1,
  STEWARDESS_1: 2,
  STEWARDESS_2: 3,
  PILOT: 4,
  AIRPLANE_LOGO: 8,
  COCKPIT_DOOR: 9,
  REGION1: 10,
  REGION2: 11,
  REGION3: 12
};

// Destructure tiles for better readability
const {
  CARPET: carpet,
  ROW: row,
  PLAYER: player,
  FLOOR: floor,
  NOTHING: nothing,
  WALL: wall,
  STEWARDESS_1: stewardess1,
  STEWARDESS_2: stewardess2,
  AIRPLANE_LOGO: airplaneLogo,
  COCKPIT_DOOR: cockpitDoor,
  REGION1: region1,
  REGION2: region2,
  REGION3: region3,
  PILOT: pilot
} = TILES;

export const MAP = {
  REGION1: [
    [wall, wall, wall, wall, wall, wall, airplaneLogo, wall, wall],
    [wall, cockpitDoor, wall, wall, wall, wall, wall, wall, wall],
    [player, floor, floor, floor, floor, stewardess1, floor, floor, stewardess2],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [row.A, row.A, carpet.A, row.A, row.A, row.A, carpet.A, row.A, row.A],
    [row.B, row.B, carpet.B, row.B, row.B, row.B, carpet.B, row.B, row.B],
    [row.C, row.C, carpet.C, row.C, row.C, row.C, carpet.C, row.C, row.C],
    [row.D, row.D, carpet.D, row.D, row.D, row.D, carpet.D, row.D, row.D],
    [nothing, nothing, nothing, nothing, nothing, nothing, region2, nothing, nothing]
  ],
  REGION2: [
    [wall, wall, airplaneLogo, wall, wall, wall, wall, wall, wall],
    [wall, wall, wall, wall, wall, wall, region1, wall, wall],
    [player, floor, floor, floor, floor, stewardess1, floor, floor, stewardess2],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [row.E, row.E, carpet.E, row.E, row.E, row.E, carpet.E, row.E, row.E],
    [row.F, row.F, carpet.F, row.F, row.F, row.F, carpet.F, row.F, row.F],
    [row.G, row.G, carpet.G, row.G, row.G, row.G, carpet.G, row.G, row.G],
    [row.H, row.H, carpet.H, row.H, row.H, row.H, carpet.H, row.H, row.H],
    [nothing, nothing, nothing, nothing, nothing, nothing, region3, nothing, nothing]
  ],
  REGION3: [
    [wall, wall, airplaneLogo, wall, wall, wall, wall, wall, wall],
    [wall, wall, wall, wall, wall, wall, region2, wall, wall],
    [player, floor, floor, floor, floor, stewardess1, floor, floor, stewardess2],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [row.I, row.I, carpet.I, row.I, row.I, row.I, carpet.I, row.I, row.I],
    [row.J, row.J, carpet.J, row.J, row.J, row.J, carpet.J, row.J, row.J],
    [row.K, row.K, carpet.K, row.K, row.K, row.K, carpet.K, row.K, row.K],
    [row.L, row.L, carpet.L, row.L, row.L, row.L, carpet.L, row.L, row.L],
    [nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing]
  ],
  COCKPIT: [
    [wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [player, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, pilot],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [nothing, region1, nothing, nothing, nothing, nothing, nothing, nothing, nothing]
  ]
};

export const GAME_CONTENTS = {
  TRANSITIONING: 'Travelling to a new part of the plane...',
  ROWS: {
    A: {
      targetTile: TILES.ROW.A,
      title: 'Row A - About Me',
      content: 'Hi my name is Carlson and am a second year studying computer science at UNSW.',
      image: './assets/content/aisleA.jpg'
    },
    B: {
      targetTile: TILES.ROW.B,
      title: 'Row B - Beliefs',
      content: 'I strongly believe that everyone\'s purpose is to help each other grow',
      image: './assets/content/aisleB.avif'
    },
    C: {
      targetTile: TILES.ROW.C,
      title: 'Row C - Characteristics',
      content: 'Considerate, Dilligent, Easygoing, Funny, Honest',
      image: './assets/content/aisleC.png'
    },
    D: {
      targetTile: TILES.ROW.D,
      title: 'Row D - Dreams',
      content: 'I want to create a language learning app (better than duolingo) that will actually help people learn languages and become fluent in them.',
      image: './assets/content/aisleD.jpg'
    },
    E: {
      targetTile: TILES.ROW.E,
      title: 'Row E - Energy Sources',
      content: 'Chocolate, Kpop (good music in general), MEMES',
      image: './assets/content/aisleE.gif'
    },
    F: {
      targetTile: TILES.ROW.F,
      title: 'Row F - Fears',
      content: 'I am afraid of bugs. Both in real life and in coding. Why do they have such weird looking legs TwT',
      image: './assets/content/aisleF.JPG'
    },
    G: {
      targetTile: TILES.ROW.G,
      title: 'Row G - Gratitude',
      content: 'Grateful to my older brother to telling me to watch Harvard\'s CS50 before I was about to choose chemical engineering to study at UNSW',
      image: './assets/content/aisleG.avif'
    },
    H: {
      targetTile: TILES.ROW.H,
      title: 'Row H - Hobbies',
      content: 'Language learning. I am currently learning Chinese (doing ARTS2450 and ARTS2451 this year!) and Korean. Would like to become a polyglot. Also like dancing.',
      image: './assets/content/aisleH.jpg'
    },
    I: {
      targetTile: TILES.ROW.I,
      title: 'Row I - Incredible Puns',
      content: 'If I don\'t get arrays from my boss I will error 404',
      image: './assets/content/aisleI.jpg'
    },
    J: {
      targetTile: TILES.ROW.J,
      title: 'Row J - Joke Time',
      content: '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011',
      image: './assets/content/aisleJ.png'
    },
    K: {
      targetTile: TILES.ROW.K,
      title: 'Row K - Kidding Time part 2',
      content: 'Yo computer science teaching mama so fat, she can flatten a binary tree in O(1). (this is not targeted at your mum)',
      image: './assets/content/aisleK.png'
    },
    L: {
      targetTile: TILES.ROW.L,
      title: 'Row L - Laugh with me Part 3',
      content: 'I once went to a fortune teller for him that for the next 20 years I will be poor and lonely. Jokes on him. I had no money to pay him :p',
      image: './assets/content/aisleL.jpg'
    }
  }
};

const SIZE = 64;

export const PLAYER = Object.freeze({
  SIZE,
  POSITION: { x: 0, y: SIZE * 2 },
  STARTING_DIRECTION: 'down',
  SPEED: 0.3,
  REGION1_POSITION: Object.freeze({ down: { x: SIZE, y: SIZE * 2 }, up: { x: SIZE * 6, y: SIZE * 7 } }),
  REGION2_POSITION: Object.freeze({ down: { x: SIZE * 6, y: SIZE * 2 }, up: { x: SIZE * 6, y: SIZE * 7 } }),
  REGION3_POSITION: Object.freeze({ down: { x: SIZE * 6, y: SIZE * 2 }, up: { x: SIZE * 6, y: SIZE * 7 } }),
  COCKPIT_POSITION: Object.freeze({ down: { x: SIZE, y: SIZE * 2 }, up: { x: SIZE, y: SIZE * 7 } })
});

export const GAME_STATS = {
  STARTING_REGION: 1,
  TOTAL_REGIONS: 3,
  TOTAL_SECRETS: 15
};
