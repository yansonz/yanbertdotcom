// 다국어 지원 시스템
const I18n = {
  lang: 'en',

  texts: {
    ko: {
      title: "얀버트 집에 오신 걸 환영합니다!",
      instructions: '🐕 방향키로 이동 | Space로 얀버트와 대화',
      dialogHint: 'Space / 탭으로 계속',
      location: '서울',
      catMeow: '야옹~',
      mailbox: {
        name: '📮 우편함',
        lines: [
          '이 편지는 영국에서 최초로 시작되어 일년에 한바퀴를 돌면서 받는 사람에게 행운을 주었습니다.',
          '지금은 당신에게로 옮겨진 이 편지는 4일 안에 당신 곁을 떠나야 합니다.',
          '이 편지를 보낸 사람은...',
          '👨 얀: <a href="https://www.linkedin.com/in/yanso" target="_blank">LinkedIn</a> | <a href="http://yanlog.yanbert.com" target="_blank">Blog</a><br>👩 로버트: <a href="https://www.linkedin.com/in/yoojin-lee-b7160511a" target="_blank">LinkedIn</a> | <a href="http://robert.yanbert.com" target="_blank">Blog</a>',
          '이 편지를 무시하면 하루에게 간식을 빼앗깁니다. 믿거나 말거나... 🐕'
        ]
      },
      yan: {
        name: '얀',
        lines: [
          '어, 하루! 왔구나~ 오늘도 산책 나왔어?',
          '정원에 새로 심은 장미가 잘 자라고 있어. 한번 봐봐!',
          '로버트가 오늘 맛있는 간식 만들었대. 가서 물어봐!',
          '날씨가 참 좋다... 하루랑 같이 있으니까 더 좋네.',
          '하루야, 넌 정말 우리 가족의 보물이야. 알지?',
          '오늘 코딩하다가 버그 잡느라 힘들었는데... 하루 보니까 힐링된다.',
          '꼬리 흔드는 거 봐~ 기분 좋은 거지? 나도 기분 좋아!',
          '고양이는 절대 못잡으니까 포기해.',
          '하루때문에 나무에 새들 다 날아간다🐦',
        ]
      },
      robert: {
        name: '로버트',
        lines: [
          '하루~ 우리 귀여운 강아지! 잘 지냈어?',
          '방금 강아지 쿠키 구웠는데, 하나 줄까? 🍪',
          '정원의 꽃들이 예쁘게 피었지? 하루가 밟지 않게 조심해줘~',
          '얀이 또 컴퓨터 앞에만 앉아있네... 하루가 가서 놀아달라고 해봐!',
          '하루야, 오늘 같이 산책 갈까? 공원에 다른 강아지 친구들도 있을 거야.',
          '우리 하루는 세상에서 제일 잘생긴 강아지야~ 맞지?',
          '간식 더 줄까? ...얀한테는 비밀이야! 🤫',
          '그럴 수 있지',
          '허락보다 용서가 쉽다!',
          '지금 음악은 모차르트 레퀴엠 Introitus 스타일의 D단조 멜로디야 어때?',
        ]
      }
    },
    en: {
      title: "Welcome to YANBERT's house!",
      instructions: '🐕 Arrow keys to move | Space to talk to YANBERT',
      dialogHint: 'Press Space to continue',
      location: 'Seoul',
      catMeow: 'Meow~',
      mailbox: {
        name: '📮 Mail Box',
        lines: [
          'DO NOT DELETE THIS MESSAGE!! Forward this to 10 friends or face 7 years of bad luck!!!',
          'A guy in Ohio ignored this in 2003 and his WiFi has been slow ever since...',
          'This message was sent by...',
          '👨 Yan: <a href="https://www.linkedin.com/in/yanso" target="_blank">LinkedIn</a> | <a href="http://yanlog.yanbert.com" target="_blank">Blog</a><br>👩 Robert: <a href="https://www.linkedin.com/in/yoojin-lee-b7160511a" target="_blank">LinkedIn</a> | <a href="http://robert.yanbert.com" target="_blank">Blog</a>',
          'If you ignore this, Haru WILL find your snacks. You have been warned... 🐕'
        ]
      },
      yan: {
        name: 'Yan',
        lines: [
          "Oh, Haru! You're here~ Out for a walk today?",
          'The roses I planted in the garden are growing well. Take a look!',
          'Robert made some tasty treats today. Go ask her!',
          "The weather is so nice... It's even better with you, Haru.",
          "Haru, you're truly our family's treasure. You know that, right?",
          'I was debugging code all day... Seeing you makes it all better.',
          "Look at that tail wagging~ You're happy, right? Me too!",
          "You'll never catch that cat, so just give up.",
          "Haru keeps scaring all the birds away from the trees 🐦",
        ]
      },
      robert: {
        name: 'Robert',
        lines: [
          'Haru~ Our cute puppy! How have you been?',
          'I just baked some doggy cookies. Want one? 🍪',
          "The flowers in the garden are so pretty! Be careful not to step on them~",
          "Yan is sitting at the computer again... Haru, go ask him to play!",
          'Haru, shall we go for a walk today? There will be other dog friends at the park.',
          "Our Haru is the most handsome dog in the world~ Right?",
          "Want more treats? ...Don't tell Yan! 🤫",
          "It happens",
          "Easier to ask forgiveness than permission!",
          "The music is Mozart's Requiem Introitus style in D minor. How do you like it?",
        ]
      }
    }
  },

  init() {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    this.lang = browserLang.startsWith('ko') ? 'ko' : 'en';
    this.applyToDOM();
  },

  get(key) {
    return this.texts[this.lang][key] || this.texts['en'][key] || key;
  },

  getNpcData(npcId) {
    return this.texts[this.lang][npcId] || this.texts['en'][npcId];
  },

  applyToDOM() {
    const titleEl = document.getElementById('title');
    if (titleEl) titleEl.textContent = this.get('title');

    const instrEl = document.querySelector('#instructions p');
    if (instrEl) instrEl.textContent = this.get('instructions');

    const hintEl = document.querySelector('.dialog-hint');
    if (hintEl) hintEl.textContent = this.get('dialogHint');

    const toggleEl = document.getElementById('lang-toggle');
    if (toggleEl) toggleEl.textContent = '🌐 ' + (this.lang === 'ko' ? '한국어' : 'EN');



    // 날씨 정보 갱신
    if (typeof Weather !== 'undefined') {
      Weather.updateInfoElement();
    }
  },

  toggle() {
    this.lang = this.lang === 'ko' ? 'en' : 'ko';
    this.applyToDOM();
  }
};
