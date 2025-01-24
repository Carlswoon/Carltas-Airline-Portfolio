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
  INTRO_MESSAGE: 'Welcome aboard! This is Carlson\'s "about me" portfolio. ' +
                 'Carlson has suddenly disappeared and we need to find him ' +
                 'now! We need your help! After this interaction you will be ' +
                 'taken to the title page in which you will find 3 buttons: ' +
                 'start, Where was Carlson Last Seen and ?. Do you have any ' +
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
  INTRO_MESSAGE1: 'The start button will commence the game and you will be ' +
                  'required to find Carlson. There\'ll be secrets to uncover ' +
                  'about Carlson which will help you find his location!',
  INTRO_MESSAGE2: 'The "Where was Carlson last seen" button will provide ' +
                  'hints about Carlson\'s personality which may help you find' +
                  ' his location! There is also a danger button which is for' +
                  'those who are unwilling to play the game and just want ' +
                  'Carlson\'s about me portfolio.',
  INTRO_MESSAGE3: 'The "?" button provides help and guidance about the game, ' +
                  'offering tips and explaining the rules to enhance your ' +
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
    L: -112
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
    L: 212
  },
  PLAYER: -21,
  FLOOR: -1,
  NOTHING: 0,
  WALL: 1,
  STEWARDESS_1: 2,
  STEWARDESS_2: 3,
  PILOT: 4,
  GLOBE: 5,
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
  PILOT: pilot,
  GLOBE: globe
} = TILES;

export const MAP = {
  REGION1: [
    [wall, wall, wall, wall, wall, wall, airplaneLogo, wall, wall],
    [wall, cockpitDoor, wall, globe, wall, wall, wall, wall, wall],
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
    [wall, globe, wall, wall, wall, wall, region1, wall, wall],
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
    [wall, globe, wall, wall, wall, wall, region2, wall, wall],
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
    [wall, globe, wall, wall, wall, wall, wall, wall, wall],
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
  TRANSITIONING: {
    EN: 'Travelling to a new part of the plane...',
    CN: '前往飞机的新部分...',
    KR: '비행기의 새로운 부분으로 이동 중...',
    PH: 'Naglalakbay sa bagong bahagi ng eroplano...'
  },
  ROWS: {
    A: {
      targetTile: TILES.ROW.A,
      title: {
        EN: 'Row A - About Me',
        CN: '第A行 - 关于我',
        KR: 'A열 - 자기소개',
        PH: 'Row A - Tungkol Sa Akin'
      },
      content: {
        EN: 'Hi my name is Carlson and am a second year studying computer science at UNSW.',
        CN: '你好，我叫Carlson，现在是UNSW的计算机科学专业二年级学生。',
        KR: '안녕하세요. 제 이름은 Carlson이고 UNSW에서 컴퓨터 과학을 2년째 공부하고 있습니다.',
        PH: 'Kumusta, ako si Carlson, isang pangalawang taong nag-aaral ng computer science sa UNSW.'
      },
      image: './assets/content/aisleA.jpg'
    },
    B: {
      targetTile: TILES.ROW.B,
      title: {
        EN: 'Row B - Beliefs',
        CN: '第B行 - 信念',
        KR: 'B열 - 신념',
        PH: 'Row B - Paniniwala'
      },
      content: {
        EN: 'I strongly believe that everyone\'s purpose is to help each other grow.',
        CN: '我坚信每个人的使命是相互帮助，共同成长。',
        KR: '모두의 목적은 서로를 성장하도록 돕는 것이라고 굳게 믿습니다.',
        PH: 'Buong puso kong naniniwala na ang layunin ng bawat isa ay tulungan ang isa’t isa na lumago.'
      },
      image: './assets/content/aisleB.avif'
    },
    C: {
      targetTile: TILES.ROW.C,
      title: {
        EN: 'Row C - Characteristics',
        CN: '第C行 - 特点',
        KR: 'C열 - 특징',
        PH: 'Row C - Mga Katangian'
      },
      content: {
        EN: 'Considerate, Dilligent, Easygoing, Funny, Honest',
        CN: '体贴、勤奋、随和、有趣、诚实',
        KR: '사려 깊음, 성실함, 털털함, 유머러스함, 정직함',
        PH: 'Maunawain, Masipag, Relax, Nakakatawa, Tapat'
      },
      image: './assets/content/aisleC.png'
    },
    D: {
      targetTile: TILES.ROW.D,
      title: {
        EN: 'Row D - Dreams',
        CN: '第D行 - 梦想',
        KR: 'D열 - 꿈',
        PH: 'Row D - Mga Pangarap'
      },
      content: {
        EN: 'I want to create a language learning app (better than Duolingo) that will actually help people learn languages and become fluent in them.',
        CN: '我想开发一个语言学习应用程序（比Duolingo更好），真正帮助人们学习语言并达到流利的水平。',
        KR: '언어 학습 앱(듀오링고보다 나은)을 만들어 사람들이 언어를 실제로 배우고 유창하게 말할 수 있도록 돕고 싶습니다.',
        PH: 'Gusto kong gumawa ng isang language learning app (mas maganda kaysa sa Duolingo) na tunay na makakatulong sa mga tao na matutunan ang mga wika at maging mahusay dito.'
      },
      image: './assets/content/aisleD.jpg'
    },
    E: {
      targetTile: TILES.ROW.E,
      title: {
        EN: 'Row E - Energy Sources',
        CN: '第E行 - 能量来源',
        KR: 'E열 - 에너지 원천',
        PH: 'Row E - Mga Pinagmumulan ng Enerhiya'
      },
      content: {
        EN: 'Chocolate, Kpop (good music in general), MEMES',
        CN: '巧克力，韩流（总体来说是好音乐），表情包',
        KR: '초콜릿, 케이팝(좋은 음악), 밈',
        PH: 'Tsokolate, Kpop (magandang musika), MEMES'
      },
      image: './assets/content/aisleE.gif'
    },
    F: {
      targetTile: TILES.ROW.F,
      title: {
        EN: 'Row F - Fears',
        CN: '第F行 - 恐惧',
        KR: 'F열 - 두려움',
        PH: 'Row F - Takot'
      },
      content: {
        EN: 'I am afraid of bugs. Both in real life and in coding. Why do they have such weird looking legs TwT',
        CN: '我害怕虫子。无论是在现实生活中还是在编码中。为什么它们的腿长得那么奇怪 TwT',
        KR: '저는 벌레가 무서워요. 현실에서도 코딩에서도요. 왜 벌레의 다리는 그렇게 이상하게 생겼을까요? TwT',
        PH: 'Natakot ako sa mga insekto. Sa totoong buhay at sa coding. Bakit kaya ang weird ng mga paa nila? TwT'
      },
      image: './assets/content/aisleF.JPG'
    },
    G: {
      targetTile: TILES.ROW.G,
      title: {
        EN: 'Row G - Gratitude',
        CN: '第G行 - 感恩',
        KR: 'G열 - 감사',
        PH: 'Row G - Pasasalamat'
      },
      content: {
        EN: 'Grateful to my older brother for telling me to watch Harvard\'s CS50 before I was about to choose chemical engineering at UNSW.',
        CN: '感谢我的哥哥在我即将选择UNSW化学工程专业时告诉我观看哈佛的CS50课程。',
        KR: '형이 UNSW에서 화학공학을 선택하기 전에 하버드의 CS50 강의를 보라고 한 것에 감사합니다.',
        PH: 'Nagpapasalamat ako sa kuya ko dahil sinabi niyang panoorin ang Harvard\'s CS50 bago ako pumili ng chemical engineering sa UNSW.'
      },
      image: './assets/content/aisleG.avif'
    },
    H: {
      targetTile: TILES.ROW.H,
      title: {
        EN: 'Row H - Hobbies',
        CN: '第H行 - 爱好',
        KR: 'H열 - 취미',
        PH: 'Row H - Mga Libangan'
      },
      content: {
        EN: 'Language learning. I am currently learning Chinese (doing ARTS2450 and ARTS2451 this year!) and Korean. Would like to become a polyglot. Also like dancing.',
        CN: '学习语言。我目前正在学习中文（今年正在学习ARTS2450和ARTS2451！）和韩语。希望成为一个多语言者。也喜欢跳舞。',
        KR: '언어 학습. 저는 현재 중국어(올해 ARTS2450 및 ARTS2451 수강 중!)와 한국어를 배우고 있습니다. 다국어 구사자가 되고 싶어요. 춤도 좋아합니다.',
        PH: 'Pag-aaral ng wika. Natututo ako ngayon ng Chinese (ginagawa ang ARTS2450 at ARTS2451 ngayong taon!) at Korean. Gusto kong maging polyglot. Mahilig din sa pagsayaw.'
      },
      image: './assets/content/aisleH.jpg'
    },
    I: {
      targetTile: TILES.ROW.I,
      title: {
        EN: 'Row I - Incredible Puns',
        CN: '第I行 - 惊人的双关语',
        KR: 'I열 - 놀라운 말장난',
        PH: 'Row I - Kamangha-manghang Puns'
      },
      content: {
        EN: 'If I don\'t get arrays from my boss I will error 404.',
        CN: '如果我没有从老板那里得到数组，我将出现404错误。',
        KR: '상사에게 배열을 받지 못하면 404 오류가 날 거예요.',
        PH: 'Kung hindi ako makakakuha ng arrays mula sa boss ko, mag-e-error ako ng 404.'
      },
      image: './assets/content/aisleI.jpg'
    },
    J: {
      targetTile: TILES.ROW.J,
      title: {
        EN: 'Row J - Joke Time',
        CN: '第J行 - 笑话时间',
        KR: 'J열 - 농담 시간',
        PH: 'Row J - Panahon ng Biro'
      },
      content: {
        EN: '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011',
        CN: '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011',
        KR: '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011',
        PH: '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011'
      },
      image: './assets/content/aisleJ.png'
    },
    K: {
      targetTile: TILES.ROW.K,
      title: {
        EN: 'Row K - Kidding Time Part 2',
        CN: '第K行 - 开玩笑时间第二部分',
        KR: 'K열 - 농담 시간 2부',
        PH: 'Row K - Panahon ng Biro Bahagi 2'
      },
      content: {
        EN: 'Yo computer science teaching mama so fat, she can flatten a binary tree in O(1). (this is not targeted at your mum)',
        CN: '你的计算机科学老师妈妈太胖了，她可以在O(1)时间内扁平化二叉树。（这不是针对你的妈妈）',
        KR: '컴퓨터 과학을 가르치는 엄마가 너무 뚱뚱해서 이진 트리를 O(1) 시간에 평평하게 만들 수 있어요. (이건 당신의 엄마를 겨냥한 게 아닙니다)',
        PH: 'Yo ang nagtuturo ng computer science mama mo sobrang taba, kaya niyang i-flatten ang binary tree sa O(1). (hindi ito para sa nanay mo)'
      },
      image: './assets/content/aisleK.png'
    },
    L: {
      targetTile: TILES.ROW.L,
      title: {
        EN: 'Row L - Laugh With Me Part 3',
        CN: '第L行 - 和我一起笑第三部分',
        KR: 'L열 - 나와 함께 웃기 3부',
        PH: 'Row L - Tumawa Kasama Ko Bahagi 3'
      },
      content: {
        EN: 'I once went to a fortune teller who told me that for the next 20 years I will be poor and lonely. Jokes on him. I had no money to pay him :p',
        CN: '我曾经去找过一个算命师，他告诉我未来20年我会贫穷和孤独。笑死他了。我根本没钱付给他 :p',
        KR: '저는 한 번 점쟁이를 찾아갔는데, 그가 앞으로 20년 동안 제가 가난하고 외로울 거라고 말했어요. 그 사람 웃기네요. 저는 그에게 돈을 낼 돈이 없었거든요 :p',
        PH: 'Minsan pumunta ako sa isang manghuhula na nagsabi sa akin na sa susunod na 20 taon ay magiging mahirap at malungkot ako. Haha sa kanya. Wala akong pera para bayaran siya :p'
      },
      image: './assets/content/aisleL.jpg'
    }
  },
  DIALOGUE: {
    EN: {
      stewardess: 'Stewardess',
      welcome: 'Welcome aboard! How can I assist you?',
      tutorialPrompt: 'I need a tutorial please',
      noHelpNeeded: 'I am all goodies :)',
      tutorialResponse: 'You can use W, A, S, D keys to move around. Use E key to interact with NPCs and secrets hidden in this plane. Do you have any more questions?',
      noResponse: 'No',
      changeMindResponse: 'Alright, let me know if you change your mind.',
      continue: 'Continue',
      pilot: 'Pilot Carlson',
      pilotIntro: 'Ah, you have finally found me! Now that you know all about me I guess I really don\'t have anything else to say...',
      continue: 'Continue',
      pilotEmail: 'BUT! If you have anymore questions, here is my email address which you can contact me at: carlson280306@gmail.com',
      thanks: 'Ok thanks',
      congratulations: 'CONGRATULATIONS',
      foundCarlson: 'YOU HAVE FOUND CARLSON!'
    },
    CN: {
      stewardess: '空姐',
      welcome: '欢迎登机！我能为您做些什么？',
      tutorialPrompt: '我需要教程，请',
      noHelpNeeded: '我一切都好 :)',
      tutorialResponse: '您可以使用 W、A、S、D 键移动。使用 E 键与 NPC 和隐藏在飞机中的秘密互动。还有其他问题吗？',
      noResponse: '没有',
      changeMindResponse: '好的，如果您改变主意，请告诉我。',
      continue: '继续',
      pilot: '机长卡尔森',
      pilotIntro: '啊，你终于找到我了！既然你已经了解了我的一切，我想我没有其他要说的了...',
      continue: '继续',
      pilotEmail: '但是！如果你还有任何问题，这是我的电子邮件地址：carlson280306@gmail.com',
      thanks: '好的，谢谢',
      congratulations: '恭喜',
      foundCarlson: '你找到了卡尔森！'
    },
    KR: {
      stewardess: '승무원',
      welcome: '탑승을 환영합니다! 무엇을 도와드릴까요?',
      tutorialPrompt: '튜토리얼이 필요해요.',
      noHelpNeeded: '저는 괜찮아요 :)',
      tutorialResponse: 'W, A, S, D 키를 사용하여 이동할 수 있습니다. NPC 및 비밀과 상호작용하려면 E 키를 사용하세요. 더 궁금한 점이 있으신가요?',
      noResponse: '아니요',
      changeMindResponse: '알겠습니다. 마음이 바뀌면 말씀해주세요.',
      continue: '계속',
      pilot: '조종사 칼슨',
      pilotIntro: '아, 드디어 나를 찾으셨군요! 이제 나에 대해 모두 알았으니 더 이상 할 말은 없어요...',
      continue: '계속',
      pilotEmail: '하지만! 질문이 더 있다면, 제 이메일 주소로 연락주세요: carlson280306@gmail.com',
      thanks: '알겠습니다, 감사합니다',
      congratulations: '축하합니다',
      foundCarlson: '칼슨을 찾으셨습니다!'
    },
    PH: {
      stewardess: 'Stewardess',
      welcome: 'Maligayang pagdating sa eroplano! Paano kita matutulungan?',
      tutorialPrompt: 'Kailangan ko ng tutorial, pakisuyo.',
      noHelpNeeded: 'Ayos lang ako :)',
      tutorialResponse: 'Puwede mong gamitin ang W, A, S, D para gumalaw. Pindutin ang E para makipag-ugnayan sa NPC at mga sikreto sa eroplano. May iba ka pang tanong?',
      noResponse: 'Wala',
      changeMindResponse: 'Sige, ipaalam mo sa akin kung magbago ang isip mo.',
      continue: 'Magpatuloy',
      pilot: 'Pilot Carlson',
      pilotIntro: 'Ah, sa wakas nahanap mo na ako! Ngayon na alam mo na ang lahat tungkol sa akin, parang wala na akong ibang sasabihin...',
      continue: 'Magpatuloy',
      pilotEmail: 'Pero! Kung may iba ka pang tanong, narito ang email address ko: carlson280306@gmail.com',
      thanks: 'Sige, salamat',
      congratulations: 'CONGRATULATIONS',
      foundCarlson: 'Nahanap mo na si Carlson!'
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
