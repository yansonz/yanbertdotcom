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
          '👨 얀: <a href="https://www.linkedin.com/in/yanso?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">LinkedIn</a> | <a href="http://yanlog.yanbert.com?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">Blog</a><br>👩 로버트: <a href="https://www.linkedin.com/in/yoojin-lee-b7160511a?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">LinkedIn</a> | <a href="http://robert.yanbert.com?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">Blog</a>',
          '이 편지를 무시하면 하루에게 간식을 빼앗깁니다. 믿거나 말거나... 🐕'
        ]
      },
      yan: {
        name: '얀',
        lines: [
          '어, 하루! 왔구나~',
          '배경음악은 프리렌 "OST Time Flows Ever Onward"로 하고 싶었는데, 저작권 때문에 AI로 비슷하게 만들었어.',
          '날씨 정보는 Open-Meteo API에서 서울지역 정보를 실시간으로 가져와. 현재 날씨에 맞게 비, 눈, 안개 같은 파티클 효과가 적용되지!',
          '낮과 밤은 실제 일출/일몰 시간을 기반으로 해. 계절마다 달라지지!',
          '이 정원은 반응형 디자인이라 모바일에서도 터치 컨트롤로 즐길 수 있어.',
          '한국어와 영어를 자동으로 감지해서 지원해. 우측 상단의 🌐 버튼으로 바꿀 수 있어!',
          '고양이는 절대 못잡으니까 포기해.',
          '하루때문에 나무에 새들 다 날아간다🐦',
          '하단에 얀버트 링크드인과 블로그 링크 남겨놨는데 확인해봐.',
          '우편함에 편지가 도착해있을거야.',
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
          '👨 Yan: <a href="https://www.linkedin.com/in/yanso?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">LinkedIn</a> | <a href="http://yanlog.yanbert.com?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">Blog</a><br>👩 Robert: <a href="https://www.linkedin.com/in/yoojin-lee-b7160511a?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">LinkedIn</a> | <a href="http://robert.yanbert.com?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">Blog</a>',
          'If you ignore this, Haru WILL find your snacks. You have been warned... 🐕'
        ]
      },
      yan: {
        name: 'Yan',
        lines: [
          "Oh, Haru! You're here~",
          'I wanted the background music to be Frieren OST "Time Flows Ever Onward", but I created it with AI due to copyright.',
          'The weather info comes from the Open-Meteo API for Seoul in real-time. Particle effects like rain, snow, and fog are applied based on the current weather!',
          'Day and night are based on actual sunrise/sunset times. They change with the seasons!',
          'This garden is responsive design, so you can enjoy it on mobile with touch controls.',
          'It automatically detects Korean and English. You can switch with the 🌐 button in the top right!',
          "You'll never catch that cat, so just give up.",
          "Haru keeps scaring all the birds away from the trees 🐦",
          "I left links to YANBERT's LinkedIn and blog at the bottom. Check them out!",
          "There should be a letter waiting in the mailbox."
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
