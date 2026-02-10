// 픽셀아트 스프라이트 렌더링 시스템
const Sprites = {
  // 하루 (누런 진돗개) - 방향별 스프라이트
  drawHaru(ctx, x, y, direction, frame) {
    const size = 32;
    ctx.save();
    ctx.translate(x, y);

    // 몸통 (누런색)
    ctx.fillStyle = '#d4a030';
    ctx.fillRect(8, 12, 16, 14);

    // 머리
    ctx.fillStyle = '#d4a030';
    if (direction === 'down') {
      ctx.fillRect(6, 2, 20, 14);
      // 귀
      ctx.fillStyle = '#b8891a';
      ctx.fillRect(6, 0, 5, 8);
      ctx.fillRect(21, 0, 5, 8);
      // 눈
      ctx.fillStyle = '#222';
      ctx.fillRect(10, 7, 3, 3);
      ctx.fillRect(19, 7, 3, 3);
      // 코
      ctx.fillStyle = '#333';
      ctx.fillRect(14, 11, 4, 3);
      // 혀 (애니메이션)
      if (frame % 2 === 0) {
        ctx.fillStyle = '#ff6b8a';
        ctx.fillRect(15, 14, 3, 3);
      }
    } else if (direction === 'up') {
      ctx.fillRect(6, 2, 20, 14);
      ctx.fillStyle = '#b8891a';
      ctx.fillRect(6, 0, 5, 8);
      ctx.fillRect(21, 0, 5, 8);
    } else if (direction === 'left') {
      ctx.fillRect(4, 2, 18, 14);
      ctx.fillStyle = '#b8891a';
      ctx.fillRect(4, 0, 5, 8);
      ctx.fillRect(16, 0, 5, 8);
      ctx.fillStyle = '#222';
      ctx.fillRect(7, 7, 3, 3);
      ctx.fillStyle = '#333';
      ctx.fillRect(5, 11, 4, 3);
    } else {
      ctx.fillRect(10, 2, 18, 14);
      ctx.fillStyle = '#b8891a';
      ctx.fillRect(11, 0, 5, 8);
      ctx.fillRect(23, 0, 5, 8);
      ctx.fillStyle = '#222';
      ctx.fillRect(22, 7, 3, 3);
      ctx.fillStyle = '#333';
      ctx.fillRect(23, 11, 4, 3);
    }

    // 다리 (걷기 애니메이션)
    ctx.fillStyle = '#c49520';
    const legOffset = Math.sin(frame * 0.3) * 2;
    ctx.fillRect(10, 26, 4, 6 + legOffset);
    ctx.fillRect(18, 26, 4, 6 - legOffset);

    // 꼬리
    ctx.fillStyle = '#d4a030';
    if (direction === 'down') {
      const tailWag = Math.sin(frame * 0.4) * 3;
      ctx.fillRect(14 + tailWag, 0, 4, 4);
    } else if (direction === 'left') {
      const tailWag = Math.sin(frame * 0.4) * 2;
      ctx.fillRect(22, 10 + tailWag, 6, 3);
    } else if (direction === 'right') {
      const tailWag = Math.sin(frame * 0.4) * 2;
      ctx.fillRect(4, 10 + tailWag, 6, 3);
    }

    ctx.restore();
  },

  // 얀 (남편) NPC
  drawYan(ctx, x, y, frame, dir, moving) {
    ctx.save();
    ctx.translate(x, y);
    const d = dir || 'down';
    const walk = moving ? Math.sin(frame * 0.15) * 3 : 0;

    // 몸통 (파란 셔츠)
    ctx.fillStyle = '#4488cc';
    ctx.fillRect(8, 16, 16, 14);

    // 머리
    ctx.fillStyle = '#f5c6a0';
    ctx.fillRect(8, 2, 16, 14);

    // 머리카락 (검은색)
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(8, 0, 16, 6);

    // 눈 (방향별)
    ctx.fillStyle = '#222';
    if (d === 'up') {
      // 뒤돌아서 눈 안 보임
    } else if (d === 'left') {
      ctx.fillRect(10, 8, 3, 3);
    } else if (d === 'right') {
      ctx.fillRect(19, 8, 3, 3);
    } else {
      ctx.fillRect(11, 8, 3, 3);
      ctx.fillRect(18, 8, 3, 3);
    }

    // 입 (미소, 앞면만)
    if (d === 'down') {
      ctx.fillStyle = '#c47a5a';
      ctx.fillRect(13, 13, 6, 2);
    }

    // 다리 (걷기 애니메이션)
    ctx.fillStyle = '#3a3a5a';
    ctx.fillRect(8, 28, 7, 6 + walk);
    ctx.fillRect(17, 28, 7, 6 - walk);

    // 팔 (걷기 시 흔들림)
    ctx.fillStyle = '#4488cc';
    ctx.fillRect(4, 18 - walk, 4, 10);
    ctx.fillRect(24, 18 + walk, 4, 10);

    ctx.restore();
  },

  // 로버트 (아내) NPC
  drawRobert(ctx, x, y, frame, dir, moving) {
    ctx.save();
    ctx.translate(x, y);
    const d = dir || 'down';
    const walk = moving ? Math.sin(frame * 0.15) * 3 : 0;

    // 몸통 (분홍 원피스)
    ctx.fillStyle = '#e87aa4';
    ctx.fillRect(6, 16, 20, 16);

    // 머리
    ctx.fillStyle = '#f5c6a0';
    ctx.fillRect(8, 2, 16, 14);

    // 머리카락 (갈색, 긴 머리)
    ctx.fillStyle = '#8b5e3c';
    ctx.fillRect(6, 0, 20, 8);
    ctx.fillRect(4, 6, 6, 18);
    ctx.fillRect(22, 6, 6, 18);

    // 눈 (방향별)
    if (d === 'up') {
      // 뒤돌아서 눈 안 보임
    } else if (d === 'left') {
      ctx.fillStyle = '#3a6a3a';
      ctx.fillRect(10, 7, 3, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(11, 8, 1, 1);
    } else if (d === 'right') {
      ctx.fillStyle = '#3a6a3a';
      ctx.fillRect(19, 7, 3, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(20, 8, 1, 1);
    } else {
      ctx.fillStyle = '#3a6a3a';
      ctx.fillRect(11, 7, 3, 4);
      ctx.fillRect(18, 7, 3, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(12, 8, 1, 1);
      ctx.fillRect(19, 8, 1, 1);
    }

    // 입 (앞면만)
    if (d === 'down') {
      ctx.fillStyle = '#d46080';
      ctx.fillRect(13, 13, 6, 2);
    }

    // 다리 (걷기 애니메이션)
    ctx.fillStyle = '#f5c6a0';
    ctx.fillRect(10, 30, 5, 4 + walk);
    ctx.fillRect(17, 30, 5, 4 - walk);

    ctx.restore();
  },

  // 나무
  drawTree(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // 줄기
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(12, 24, 8, 16);
    // 잎
    ctx.fillStyle = '#2d8a4e';
    ctx.fillRect(2, 4, 28, 12);
    ctx.fillRect(6, 0, 20, 8);
    ctx.fillRect(0, 10, 32, 14);
    ctx.fillStyle = '#3aad5c';
    ctx.fillRect(4, 6, 10, 8);
    ctx.fillRect(18, 2, 8, 10);
    ctx.restore();
  },

  // 꽃
  drawFlower(ctx, x, y, color, frame) {
    ctx.save();
    ctx.translate(x, y);
    const sway = Math.sin(frame * 0.03 + x) * 1;
    // 줄기
    ctx.fillStyle = '#4a8a3a';
    ctx.fillRect(6 + sway, 8, 2, 10);
    // 꽃잎
    ctx.fillStyle = color;
    ctx.fillRect(4 + sway, 2, 6, 6);
    ctx.fillRect(2 + sway, 4, 10, 4);
    // 꽃 중심
    ctx.fillStyle = '#f0d060';
    ctx.fillRect(6 + sway, 4, 2, 2);
    ctx.restore();
  },

  // 집
  drawHouse(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // 지붕 (삼각형 주택 스타일)
    ctx.fillStyle = '#a0522d';
    // 삼각형을 한 줄씩 쌓아서 표현
    const roofTop = 0;
    const roofBottom = 32;
    const roofLeft = 0;
    const roofRight = 128;
    const roofCenter = 64;
    const roofHeight = roofBottom - roofTop;
    for (let row = 0; row < roofHeight; row++) {
      const progress = row / roofHeight;
      const left = roofCenter - (roofCenter - roofLeft) * progress;
      const right = roofCenter + (roofRight - roofCenter) * progress;
      ctx.fillRect(left, roofTop + row, right - left, 1);
    }
    // 지붕 테두리 (어두운 색)
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(0, 30, 128, 4);
    // 지붕 꼭대기 장식
    ctx.fillStyle = '#c0652d';
    for (let row = 0; row < 6; row++) {
      const progress = row / roofHeight;
      const left = roofCenter - (roofCenter - roofLeft) * progress;
      const right = roofCenter + (roofRight - roofCenter) * progress;
      ctx.fillRect(left, roofTop + row, right - left, 1);
    }

    // 벽
    ctx.fillStyle = '#f5e6c8';
    ctx.fillRect(8, 32, 112, 80);

    // 벽 테두리
    ctx.fillStyle = '#d4c4a0';
    ctx.fillRect(8, 32, 112, 4);
    ctx.fillRect(8, 32, 4, 80);
    ctx.fillRect(116, 32, 4, 80);

    // 문
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(48, 64, 32, 48);
    // 문 손잡이
    ctx.fillStyle = '#f0d060';
    ctx.fillRect(72, 86, 4, 4);

    // 창문 왼쪽
    ctx.fillStyle = '#88ccee';
    ctx.fillRect(16, 48, 24, 20);
    ctx.fillStyle = '#fff';
    ctx.fillRect(27, 48, 2, 20);
    ctx.fillRect(16, 57, 24, 2);

    // 창문 오른쪽
    ctx.fillStyle = '#88ccee';
    ctx.fillRect(88, 48, 24, 20);
    ctx.fillStyle = '#fff';
    ctx.fillRect(99, 48, 2, 20);
    ctx.fillRect(88, 57, 24, 2);

    ctx.restore();
  },

  // 울타리
  drawFence(ctx, x, y, width) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#d4b896';
    // 가로 막대
    ctx.fillRect(0, 4, width, 3);
    ctx.fillRect(0, 14, width, 3);
    // 세로 기둥
    for (let i = 0; i < width; i += 16) {
      ctx.fillStyle = '#c4a878';
      ctx.fillRect(i, 0, 4, 20);
      // 기둥 꼭대기
      ctx.fillStyle = '#d4b896';
      ctx.fillRect(i - 1, -2, 6, 3);
    }
    ctx.restore();
  },

  // 잔디 타일
  drawGrass(ctx, x, y) {
    ctx.fillStyle = '#5cb85c';
    ctx.fillRect(x, y, 32, 32);
    // 잔디 디테일
    ctx.fillStyle = '#4da84d';
    ctx.fillRect(x + 4, y + 8, 2, 4);
    ctx.fillRect(x + 20, y + 16, 2, 4);
    ctx.fillRect(x + 12, y + 24, 2, 3);
  },

  // 길 타일 (돌바닥)
  drawPath(ctx, x, y) {
    // 바닥 베이스 (회색)
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(x, y, 32, 32);
    
    // 돌 패턴
    ctx.fillStyle = '#9a9a9a';
    ctx.fillRect(x + 2, y + 2, 12, 10);
    ctx.fillRect(x + 16, y + 4, 14, 8);
    ctx.fillRect(x + 4, y + 14, 10, 8);
    ctx.fillRect(x + 16, y + 14, 12, 10);
    ctx.fillRect(x + 2, y + 24, 14, 6);
    ctx.fillRect(x + 18, y + 26, 12, 5);
    
    // 돌 하이라이트
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(x + 3, y + 3, 4, 2);
    ctx.fillRect(x + 17, y + 5, 4, 2);
    ctx.fillRect(x + 5, y + 15, 3, 2);
    ctx.fillRect(x + 17, y + 15, 4, 2);
    
    // 돌 사이 틈 (어두운 선)
    ctx.fillStyle = '#6a6a6a';
    ctx.fillRect(x + 14, y, 2, 12);
    ctx.fillRect(x, y + 12, 32, 2);
    ctx.fillRect(x + 14, y + 14, 2, 10);
    ctx.fillRect(x, y + 24, 32, 2);
    ctx.fillRect(x + 16, y + 24, 2, 8);
  },

  // 상호작용 아이콘 (느낌표)
  drawInteractIcon(ctx, x, y, frame) {
    const bounce = Math.sin(frame * 0.1) * 3;
    ctx.save();
    ctx.translate(x + 12, y - 12 + bounce);
    ctx.fillStyle = '#f0d060';
    ctx.fillRect(0, 0, 8, 12);
    ctx.fillRect(2, 14, 4, 4);
    ctx.restore();
  },

  // 고양이 (까만 길고양이)
  drawCat(ctx, x, y, frame, dir, moving) {
    ctx.save();
    ctx.translate(x, y);
    const d = dir || 'down';
    const walk = moving ? Math.sin(frame * 0.2) * 3 : 0;

    // 몸통 (검은색)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(6, 10, 16, 10);

    // 머리
    ctx.fillStyle = '#222';
    if (d === 'down') {
      ctx.fillRect(6, 2, 16, 10);
      // 귀
      ctx.fillStyle = '#111';
      ctx.fillRect(6, 0, 5, 5);
      ctx.fillRect(17, 0, 5, 5);
      // 귀 안쪽
      ctx.fillStyle = '#553040';
      ctx.fillRect(8, 1, 2, 3);
      ctx.fillRect(19, 1, 2, 3);
      // 눈 (노란 눈)
      ctx.fillStyle = '#e8c020';
      ctx.fillRect(9, 5, 3, 3);
      ctx.fillRect(16, 5, 3, 3);
      ctx.fillStyle = '#111';
      ctx.fillRect(10, 6, 1, 2);
      ctx.fillRect(17, 6, 1, 2);
      // 코+입
      ctx.fillStyle = '#553040';
      ctx.fillRect(13, 8, 2, 2);
    } else if (d === 'up') {
      ctx.fillRect(6, 2, 16, 10);
      ctx.fillStyle = '#111';
      ctx.fillRect(6, 0, 5, 5);
      ctx.fillRect(17, 0, 5, 5);
    } else if (d === 'left') {
      ctx.fillRect(4, 2, 14, 10);
      ctx.fillStyle = '#111';
      ctx.fillRect(4, 0, 5, 5);
      ctx.fillRect(12, 0, 5, 5);
      ctx.fillStyle = '#e8c020';
      ctx.fillRect(6, 5, 3, 3);
      ctx.fillStyle = '#111';
      ctx.fillRect(7, 6, 1, 2);
    } else {
      ctx.fillRect(10, 2, 14, 10);
      ctx.fillStyle = '#111';
      ctx.fillRect(11, 0, 5, 5);
      ctx.fillRect(19, 0, 5, 5);
      ctx.fillStyle = '#e8c020';
      ctx.fillRect(19, 5, 3, 3);
      ctx.fillStyle = '#111';
      ctx.fillRect(20, 6, 1, 2);
    }

    // 다리
    ctx.fillStyle = '#111';
    ctx.fillRect(7, 18, 4, 5 + walk);
    ctx.fillRect(17, 18, 4, 5 - walk);

    // 꼬리
    ctx.fillStyle = '#1a1a1a';
    if (d === 'down' || d === 'up') {
      const tailWag = Math.sin(frame * 0.15) * 4;
      ctx.fillRect(20 + tailWag, 12, 3, 8);
    } else if (d === 'left') {
      const tailWag = Math.sin(frame * 0.15) * 3;
      ctx.fillRect(18, 8 + tailWag, 8, 3);
    } else {
      const tailWag = Math.sin(frame * 0.15) * 3;
      ctx.fillRect(2, 8 + tailWag, 8, 3);
    }

    ctx.restore();
  },

  // 고양이 말풍선 (야옹)
  drawCatBubble(ctx, x, y, frame) {
    ctx.save();
    const text = I18n.get('catMeow');
    const bx = x + 12;
    const by = y - 16;
    const bounce = Math.sin(frame * 0.06) * 2;

    // 말풍선 너비를 텍스트에 맞게 조정
    ctx.font = '9px DungGeunMo, monospace';
    const tw = ctx.measureText(text).width;
    const bw = Math.max(tw + 10, 36);
    const bxStart = bx - bw / 2;

    // 말풍선 배경
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillRect(bxStart, by - 10 + bounce, bw, 14);
    // 꼬리 (삼각형)
    ctx.fillRect(bx - 2, by + 4 + bounce, 4, 3);

    // 테두리
    ctx.fillStyle = '#888';
    ctx.fillRect(bxStart - 1, by - 10 + bounce, 1, 14);
    ctx.fillRect(bxStart + bw, by - 10 + bounce, 1, 14);
    ctx.fillRect(bxStart, by - 11 + bounce, bw, 1);
    ctx.fillRect(bxStart, by + 4 + bounce, bw, 1);

    // 텍스트
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(text, bx, by + 1 + bounce);

    ctx.restore();
  },

  // 새 (나무 위에 앉아있는 상태)
  drawBirdPerched(ctx, x, y, color, frame) {
    ctx.save();
    ctx.translate(x, y);
    // 몸통
    ctx.fillStyle = color;
    ctx.fillRect(0, 2, 6, 4);
    // 머리
    ctx.fillRect(5, 0, 4, 4);
    // 부리
    ctx.fillStyle = '#f0a030';
    ctx.fillRect(9, 1, 2, 2);
    // 눈
    ctx.fillStyle = '#111';
    ctx.fillRect(7, 1, 1, 1);
    // 꼬리
    ctx.fillStyle = color;
    ctx.fillRect(-2, 1, 3, 2);
    // 다리
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(1, 6, 1, 2);
    ctx.fillRect(4, 6, 1, 2);
    ctx.restore();
  },

  // 새 (날아가는 상태)
  drawBirdFlying(ctx, x, y, color, wingFrame) {
    ctx.save();
    ctx.translate(x, y);
    // 몸통
    ctx.fillStyle = color;
    ctx.fillRect(0, 2, 6, 3);
    // 머리
    ctx.fillRect(5, 1, 3, 3);
    // 부리
    ctx.fillStyle = '#f0a030';
    ctx.fillRect(8, 2, 2, 1);
    // 날개 (퍼덕임)
    ctx.fillStyle = color;
    const wingUp = Math.sin(wingFrame * 0.5) > 0;
    if (wingUp) {
      ctx.fillRect(1, -2, 4, 3);
    } else {
      ctx.fillRect(1, 5, 4, 3);
    }
    ctx.restore();
  },

  // 우편함
  drawMailbox(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x, y);

    // 기둥
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(10, 16, 4, 16);

    // 몸통
    ctx.fillStyle = '#4a7abc';
    ctx.fillRect(2, 2, 20, 14);

    // 지붕 (반원형 느낌)
    ctx.fillStyle = '#3a6aac';
    ctx.fillRect(1, 0, 22, 4);

    // 투입구
    ctx.fillStyle = '#2a4a7c';
    ctx.fillRect(5, 6, 14, 3);

    // 깃발 (빨간색, 흔들림)
    const flagWave = Math.sin(frame * 0.05) * 1;
    ctx.fillStyle = '#e04040';
    ctx.fillRect(22, 3 + flagWave, 4, 6);
    ctx.fillStyle = '#c03030';
    ctx.fillRect(22, 3 + flagWave, 1, 6);

    ctx.restore();
  }
};
