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
        lines: [], // RSS 피드로 동적 생성
        loading: '블로그 최신글을 불러오는 중...',
        error: '블로그 글을 불러올 수 없습니다.'
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
        lines: [], // RSS 피드로 동적 생성
        loading: 'Loading latest blog posts...',
        error: 'Unable to load blog posts.'
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

  async init() {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    this.lang = browserLang.startsWith('ko') ? 'ko' : 'en';
    this.applyToDOM();
    await this.loadRssFeed();
  },

  async loadRssFeed() {
    const rssFeeds = [
      {
        name: 'Yan',
        nameKo: '얀',
        url: this.lang === 'ko' 
          ? 'https://yanlog.yanbert.com/ko/rss.xml'
          : 'https://yanlog.yanbert.com/en/rss.xml',
        blogUrl: this.lang === 'ko'
          ? 'https://yanlog.yanbert.com/ko/blog'
          : 'https://yanlog.yanbert.com/en/blog'
      },
      {
        name: 'Robert',
        nameKo: '로버트',
        url: 'https://rss.blog.naver.com/jonasmemo.xml',
        blogUrl: this.lang === 'ko'
          ? 'https://robert.yanbert.com/ko/blog'
          : 'https://robert.yanbert.com/en/blog'
      }
    ];
    
    try {
      const allPosts = [];
      
      // 모든 RSS 피드에서 최신글 가져오기
      for (const feed of rssFeeds) {
        try {
          const response = await fetch(feed.url);
          const text = await response.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, 'text/xml');
          
          const items = xml.querySelectorAll('item');
          
          if (items.length > 0) {
            const item = items[0];
            const title = item.querySelector('title')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            
            // HTML 태그 제거 및 길이 제한
            const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 150);
            
            // 발행일로부터 경과 일수 계산 (KST 기준)
            let daysAgo = '';
            let publishDate = null;
            if (pubDate) {
              publishDate = new Date(pubDate); // 이미 KST 기준
              // KST 기준 현재 시간 (UTC+9)
              const now = new Date();
              const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
              
              // 날짜만 비교 (시간 제거)
              const nowDate = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
              const publishDateOnly = new Date(publishDate.getFullYear(), publishDate.getMonth(), publishDate.getDate());
              
              const diffTime = Math.abs(nowDate - publishDateOnly);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              if (this.lang === 'ko') {
                if (diffDays === 0) {
                  daysAgo = '오늘 작성';
                } else if (diffDays === 1) {
                  daysAgo = '어제 작성';
                } else {
                  daysAgo = `${diffDays}일 전 작성`;
                }
              } else {
                if (diffDays === 0) {
                  daysAgo = 'Posted today';
                } else if (diffDays === 1) {
                  daysAgo = 'Posted yesterday';
                } else {
                  daysAgo = `Posted ${diffDays} days ago`;
                }
              }
            }
            
            allPosts.push({
              author: this.lang === 'ko' ? feed.nameKo : feed.name,
              title,
              link,
              description: cleanDesc,
              daysAgo,
              publishDate,
              blogUrl: feed.blogUrl
            });
          }
        } catch (feedError) {
          console.error(`RSS 피드 로드 실패 (${feed.name}):`, feedError);
        }
      }
      
      // 발행일 기준 최신순 정렬
      allPosts.sort((a, b) => {
        if (!a.publishDate) return 1;
        if (!b.publishDate) return -1;
        return b.publishDate - a.publishDate;
      });
      
      // 메일함 대화 내용 생성 (각 블로그별 별도 다이얼로그)
      const mailboxData = this.texts[this.lang].mailbox;
      mailboxData.lines = [];
      
      if (allPosts.length > 0) {
        allPosts.forEach(post => {
          if (this.lang === 'ko') {
            mailboxData.lines.push(`📬 ${post.author}의 블로그 최신글<br><br><strong>${post.title}</strong><br><em>${post.daysAgo}</em><br><br>${post.description}...<br><br><a href="${post.link}?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">📖 글 읽으러 가기</a> | <a href="${post.blogUrl}?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">더 많은 글 보기</a>`);
          } else {
            mailboxData.lines.push(`📬 ${post.author}'s Latest Blog Post<br><br><strong>${post.title}</strong><br><em>${post.daysAgo}</em><br><br>${post.description}...<br><br><a href="${post.link}?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">📖 Read more</a> | <a href="${post.blogUrl}?utm_source=yanbertdotcom&utm_medium=web&utm_campaign=mailbox" target="_blank">More posts</a>`);
          }
        });
      } else {
        mailboxData.lines = [mailboxData.error];
      }
    } catch (error) {
      console.error('RSS 피드 로드 실패:', error);
      const mailboxData = this.texts[this.lang].mailbox;
      mailboxData.lines = [mailboxData.error];
    }
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

  async toggle() {
    this.lang = this.lang === 'ko' ? 'en' : 'ko';
    this.applyToDOM();
    await this.loadRssFeed();
  }
};
