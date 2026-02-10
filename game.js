// 메인 게임 엔진
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 내부 해상도 고정 (렌더링 기준)
const INTERNAL_W = 480;
const INTERNAL_H = 416;
canvas.width = INTERNAL_W;
canvas.height = INTERNAL_H;

// 게임 상태
const game = {
  width: INTERNAL_W,
  height: INTERNAL_H,
  tileSize: 32,
  frame: 0,
  keys: {},

  // 카메라
  camera: { x: 0, y: 0 },

  // 월드맵 크기 (타일 단위) - 1/4 축소
  mapCols: 15,
  mapRows: 13,

  // 플레이어 (하루)
  player: {
    x: 176,
    y: 300,
    speed: 2.5,
    direction: 'down',
    moving: false,
    width: 32,
    height: 34
  },

  // NPC 목록
  npcs: [
    {
      id: 'yan',
      x: 168,
      y: 200,
      width: 32,
      height: 34,
      speed: 0.6,
      direction: 'down',
      ai: { targetX: 168, targetY: 200, waitTimer: 0, moving: false },
      draw: (ctx, x, y, frame, dir, moving) => Sprites.drawYan(ctx, x, y, frame, dir, moving)
    },
    {
      id: 'robert',
      x: 272,
      y: 210,
      width: 32,
      height: 34,
      speed: 0.5,
      direction: 'down',
      ai: { targetX: 272, targetY: 210, waitTimer: 0, moving: false },
      draw: (ctx, x, y, frame, dir, moving) => Sprites.drawRobert(ctx, x, y, frame, dir, moving)
    }
  ],

  // 꽃 위치
  flowers: [],

  // 나무 위치
  trees: [],

  // 충돌 영역
  colliders: [],

  // 우편함
  mailbox: { x: 240, y: 304, width: 24, height: 32 },

  // 고양이 (도망가는 길고양이)
  cat: {
    x: 350, y: 350,
    width: 24, height: 24,
    speed: 1.2,
    fleeSpeed: 4,
    direction: 'left',
    moving: false,
    fleeing: false,
    hasEverFled: false,
    waitTimer: 60,
    targetX: 350, targetY: 350,
    fleeAngle: 0,
    fleeLock: 0
  }
};

// 맵 타일 타입: 0=잔디, 1=길
const tileMap = [];

function initMap() {
  for (let r = 0; r < game.mapRows; r++) {
    tileMap[r] = [];
    for (let c = 0; c < game.mapCols; c++) {
      tileMap[r][c] = 0;
    }
  }

  // 길 배치 (집 문 앞에서 아래로)
  for (let r = 5; r < game.mapRows; r++) {
    tileMap[r][6] = 1;
  }
  // 가로 길
  for (let c = 3; c < 10; c++) {
    tileMap[9][c] = 1;
  }

  // 집 영역 (충돌)
  game.colliders.push({ x: 144, y: 32, w: 128, h: 112 });

  // 울타리 충돌 (정원 둘레) - 상단은 문 앞 빈 공간
  game.colliders.push({ x: 80, y: 148, w: 112, h: 8 });    // 위 왼쪽 (80~192)
  game.colliders.push({ x: 224, y: 148, w: 112, h: 8 });   // 위 오른쪽 (224~336)
  game.colliders.push({ x: 80, y: 148, w: 8, h: 168 });    // 왼쪽
  game.colliders.push({ x: 328, y: 148, w: 8, h: 168 });   // 오른쪽


  // 나무 배치
  game.trees = [
    { x: 16, y: 40 }, { x: 368, y: 32 },
    { x: 16, y: 200 }, { x: 400, y: 180 },
    { x: 32, y: 340 }, { x: 384, y: 320 },
  ];

  // 나무별 새 초기화 (각 나무에 1~2마리, 1회만 도망)
  game.birds = [];
  game.trees.forEach((t, i) => {
    const count = 1 + (i % 2); // 1~2마리
    for (let b = 0; b < count; b++) {
      game.birds.push({
        treeIdx: i,
        x: t.x + 8 + b * 12,
        y: t.y + 2 + b * 4,
        perched: true,       // 나무에 앉아있는 상태
        fled: false,         // 이미 도망갔는지
        flyX: 0, flyY: 0,    // 날아가는 좌표
        flyVx: 0, flyVy: 0,  // 날아가는 속도
        flyTimer: 0,          // 날아가는 타이머
        wingFrame: 0,
        color: ['#6b4226', '#555', '#8b6914'][b % 3]
      });
    }
  });

  // 나무 충돌
  game.trees.forEach(t => {
    game.colliders.push({ x: t.x + 8, y: t.y + 20, w: 16, h: 20 });
  });

  // 우편함 충돌
  game.colliders.push({ x: game.mailbox.x, y: game.mailbox.y + 8, w: game.mailbox.width, h: game.mailbox.height - 8 });

  // 꽃 배치 (정원 안)
  const flowerColors = ['#ff6b8a', '#ff9ecd', '#ffeb3b', '#e040fb', '#ff7043', '#7c4dff'];
  const flowerPositions = [
    { x: 104, y: 172 }, { x: 120, y: 212 }, { x: 104, y: 252 },
    { x: 120, y: 280 },
    { x: 296, y: 172 }, { x: 304, y: 212 }, { x: 296, y: 252 },
    { x: 304, y: 280 },
    { x: 160, y: 168 }, { x: 232, y: 168 }, { x: 264, y: 168 },
    { x: 136, y: 304 }, { x: 264, y: 304 }, { x: 296, y: 304 },
  ];
  game.flowers = flowerPositions.map((p, i) => ({
    ...p,
    color: flowerColors[i % flowerColors.length]
  }));
}

// 충돌 검사
function checkCollision(x, y, w, h) {
  const mapW = game.mapCols * game.tileSize;
  const mapH = game.mapRows * game.tileSize;
  if (x < 0 || y < 0 || x + w > mapW || y + h > mapH) return true;

  for (const c of game.colliders) {
    if (x < c.x + c.w && x + w > c.x && y < c.y + c.h && y + h > c.y) {
      return true;
    }
  }

  for (const npc of game.npcs) {
    if (x < npc.x + npc.width && x + w > npc.x &&
        y < npc.y + npc.height && y + h > npc.y) {
      return true;
    }
  }

  return false;
}

// NPC 근접 확인
function getNearbyNpc() {
  const p = game.player;
  const interactDist = 48;

  for (const npc of game.npcs) {
    const dx = (p.x + p.width / 2) - (npc.x + npc.width / 2);
    const dy = (p.y + p.height / 2) - (npc.y + npc.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < interactDist) return npc;
  }

  // 우편함 체크
  const mb = game.mailbox;
  const mdx = (p.x + p.width / 2) - (mb.x + mb.width / 2);
  const mdy = (p.y + p.height / 2) - (mb.y + mb.height / 2);
  const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
  if (mdist < interactDist) return { id: 'mailbox', x: mb.x, y: mb.y, width: mb.width, height: mb.height };

  return null;
}

// 입력 처리
document.addEventListener('keydown', (e) => {
  game.keys[e.code] = true;

  if (e.code === 'Space') {
    e.preventDefault();
    if (DialogSystem.active) {
      DialogSystem.advance();
    } else {
      const npc = getNearbyNpc();
      if (npc) DialogSystem.start(npc.id);
    }
  }
});

document.addEventListener('keyup', (e) => {
  game.keys[e.code] = false;
});

// 플레이어 이동
function updatePlayer() {
  if (DialogSystem.active) return;

  const p = game.player;
  const dt = game.dt;
  let dx = 0, dy = 0;
  p.moving = false;

  // 키보드 입력
  if (game.keys['ArrowUp'] || game.keys['KeyW']) { dy = -p.speed; p.direction = 'up'; p.moving = true; }
  if (game.keys['ArrowDown'] || game.keys['KeyS']) { dy = p.speed; p.direction = 'down'; p.moving = true; }
  if (game.keys['ArrowLeft'] || game.keys['KeyA']) { dx = -p.speed; p.direction = 'left'; p.moving = true; }
  if (game.keys['ArrowRight'] || game.keys['KeyD']) { dx = p.speed; p.direction = 'right'; p.moving = true; }

  // 조이스틱 입력 (키보드 미사용 시)
  if (!p.moving && joystick.active && (joystick.dx !== 0 || joystick.dy !== 0)) {
    dx = joystick.dx * p.speed;
    dy = joystick.dy * p.speed;
    p.moving = true;

    // 방향 결정 (더 큰 축 기준)
    if (Math.abs(joystick.dx) > Math.abs(joystick.dy)) {
      p.direction = joystick.dx > 0 ? 'right' : 'left';
    } else {
      p.direction = joystick.dy > 0 ? 'down' : 'up';
    }
  }

  if (dx !== 0 && dy !== 0) {
    const len = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / len) * p.speed;
    dy = (dy / len) * p.speed;
  }

  // delta time 적용
  dx *= dt;
  dy *= dt;

  if (dx !== 0 && !checkCollision(p.x + dx, p.y, p.width - 8, p.height - 8)) {
    p.x += dx;
  }
  if (dy !== 0 && !checkCollision(p.x, p.y + dy, p.width - 8, p.height - 8)) {
    p.y += dy;
  }
}

// 카메라 업데이트
function updateCamera() {
  const p = game.player;
  const targetX = p.x - game.width / 2 + p.width / 2;
  const targetY = p.y - game.height / 2 + p.height / 2;

  game.camera.x += (targetX - game.camera.x) * 0.1;
  game.camera.y += (targetY - game.camera.y) * 0.1;

  const mapW = game.mapCols * game.tileSize;
  const mapH = game.mapRows * game.tileSize;
  game.camera.x = Math.max(0, Math.min(game.camera.x, mapW - game.width));
  game.camera.y = Math.max(0, Math.min(game.camera.y, mapH - game.height));
}

// 렌더링
function render() {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.save();
  ctx.translate(-Math.round(game.camera.x), -Math.round(game.camera.y));

  // 타일맵 렌더링
  const startCol = Math.floor(game.camera.x / game.tileSize);
  const startRow = Math.floor(game.camera.y / game.tileSize);
  const endCol = Math.min(startCol + Math.ceil(game.width / game.tileSize) + 1, game.mapCols);
  const endRow = Math.min(startRow + Math.ceil(game.height / game.tileSize) + 1, game.mapRows);

  for (let r = startRow; r < endRow; r++) {
    for (let c = startCol; c < endCol; c++) {
      const x = c * game.tileSize;
      const y = r * game.tileSize;
      if (tileMap[r] && tileMap[r][c] === 1) {
        Sprites.drawPath(ctx, x, y);
      } else {
        Sprites.drawGrass(ctx, x, y);
      }
    }
  }

  // 집 그리기
  Sprites.drawHouse(ctx, 144, 32);

  // 울타리 그리기
  Sprites.drawFence(ctx, 80, 148, 112);    // 위 왼쪽
  Sprites.drawFence(ctx, 224, 148, 112);   // 위 오른쪽
  for (let y = 148; y < 316; y += 20) {
    Sprites.drawFence(ctx, 80, y, 8);     // 왼쪽
  }
  for (let y = 148; y < 316; y += 20) {
    Sprites.drawFence(ctx, 328, y, 8);    // 오른쪽
  }

  // 꽃 그리기
  game.flowers.forEach(f => {
    Sprites.drawFlower(ctx, f.x, f.y, f.color, game.frame);
  });

  // 나무 그리기
  game.trees.forEach(t => {
    Sprites.drawTree(ctx, t.x, t.y);
  });

  // 새 그리기 (날아가는 새만)
  game.birds.forEach(bird => {
    if (!bird.perched && bird.flyTimer > 0) {
      Sprites.drawBirdFlying(ctx, bird.flyX, bird.flyY, bird.color, bird.wingFrame);
    }
  });

  // 우편함 그리기
  Sprites.drawMailbox(ctx, game.mailbox.x, game.mailbox.y, game.frame);
  const nearTarget = getNearbyNpc();
  if (nearTarget && nearTarget.id === 'mailbox' && !DialogSystem.active) {
    Sprites.drawInteractIcon(ctx, game.mailbox.x, game.mailbox.y, game.frame);
  }

  // NPC 그리기
  game.npcs.forEach(npc => {
    npc.draw(ctx, npc.x, npc.y, game.frame, npc.direction, npc.ai.moving);
    const nearNpc = getNearbyNpc();
    if (nearNpc && nearNpc.id === npc.id && !DialogSystem.active) {
      Sprites.drawInteractIcon(ctx, npc.x, npc.y, game.frame);
    }
  });

  // 플레이어 (하루) 그리기
  const animFrame = game.player.moving ? game.frame : 0;
  Sprites.drawHaru(ctx, game.player.x, game.player.y, game.player.direction, animFrame);

  // 고양이 그리기
  const cat = game.cat;
  Sprites.drawCat(ctx, cat.x, cat.y, game.frame, cat.direction, cat.moving || cat.fleeing);
  // 도망 전까지 야옹 말풍선
  if (!cat.hasEverFled && !cat.fleeing) {
    Sprites.drawCatBubble(ctx, cat.x, cat.y, game.frame);
  }

  // 밤에 집 창문 불빛 (월드 좌표)
  if (DayNight.phase === 'night' || (DayNight.phase === 'dusk' && DayNight.hour > 18.5)) {
    ctx.fillStyle = 'rgba(255, 220, 100, 0.5)';
    ctx.fillRect(160, 80, 24, 20);  // 왼쪽 창문
    ctx.fillRect(232, 80, 24, 20);  // 오른쪽 창문
    ctx.fillStyle = 'rgba(255, 200, 80, 0.3)';
    ctx.fillRect(192, 96, 32, 48);  // 문 불빛
  }

  ctx.restore();

  // 날씨 효과 (화면 좌표계에서 렌더링)
  Weather.render(ctx, game.camera.x, game.camera.y, INTERNAL_W, INTERNAL_H);

  // 낮/밤 효과 (날씨 위에 렌더링)
  DayNight.render(ctx, INTERNAL_W, INTERNAL_H);


}

// 새 업데이트 (나무 근처 접근 시 날아감)
function updateBirds() {
  const p = game.player;
  const fleeDist = 50;

  game.birds.forEach(bird => {
    if (bird.fled && bird.flyTimer <= 0) return; // 이미 사라짐

    if (bird.perched) {
      // 플레이어와의 거리 체크
      const dx = (p.x + p.width / 2) - bird.x;
      const dy = (p.y + p.height / 2) - bird.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < fleeDist) {
        // 날아가기 시작
        bird.perched = false;
        bird.fled = true;
        bird.flyX = bird.x;
        bird.flyY = bird.y;
        // 플레이어 반대 방향 + 위로
        const angle = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 1.2;
        bird.flyVx = Math.cos(angle) * (2 + Math.random());
        bird.flyVy = -(2 + Math.random() * 2); // 위로 날아감
        bird.flyTimer = 60; // 60프레임 후 사라짐
      }
    } else if (bird.flyTimer > 0) {
      // 날아가는 중
      bird.flyX += bird.flyVx * game.dt;
      bird.flyY += bird.flyVy * game.dt;
      bird.flyVy -= 0.02 * game.dt; // 약간 위로 가속
      bird.wingFrame++;
      bird.flyTimer--;
    }
  });
}

// 고양이 AI (하루가 가까이 오면 도망)
function updateCat() {
  const cat = game.cat;
  const p = game.player;
  const dt = game.dt;
  const mapW = game.mapCols * game.tileSize;
  const mapH = game.mapRows * game.tileSize;

  // 하루와의 거리 계산
  const dx = (p.x + p.width / 2) - (cat.x + cat.width / 2);
  const dy = (p.y + p.height / 2) - (cat.y + cat.height / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  const fleeDist = 70; // 도망 시작 거리

  if (dist < fleeDist) {
    // 도망 모드
    cat.fleeing = true;
    cat.moving = true;
    cat.hasEverFled = true;

    // fleeLock이 남아있으면 기존 방향 유지
    if (cat.fleeLock > 0) {
      cat.fleeLock--;
      const nx = cat.x + Math.cos(cat.fleeAngle) * cat.fleeSpeed * dt;
      const ny = cat.y + Math.sin(cat.fleeAngle) * cat.fleeSpeed * dt;

      // 기존 방향으로 갈 수 있으면 계속 진행
      if (nx >= 8 && nx + cat.width <= mapW - 8 &&
          ny >= 8 && ny + cat.height <= mapH - 8 &&
          !checkCollisionForCat(nx, ny)) {
        cat.x = nx;
        cat.y = ny;
        return;
      }
      // 막히면 잠금 해제하고 새 방향 탐색
      cat.fleeLock = 0;
    }

    // 새 도망 방향 계산
    const angle = Math.atan2(-dy, -dx);
    const tryAngles = [0, 0.4, -0.4, 0.8, -0.8, 1.2, -1.2, 1.6, -1.6, 2.0, -2.0, Math.PI];
    let escaped = false;

    for (const offset of tryAngles) {
      const a = angle + offset;
      const nx = cat.x + Math.cos(a) * cat.fleeSpeed * dt;
      const ny = cat.y + Math.sin(a) * cat.fleeSpeed * dt;

      if (nx < 8 || nx + cat.width > mapW - 8 || ny < 8 || ny + cat.height > mapH - 8) continue;
      if (checkCollisionForCat(nx, ny)) continue;

      const newDist = Math.sqrt((p.x - nx) ** 2 + (p.y - ny) ** 2);
      if (newDist <= dist * 0.9) continue;

      cat.x = nx;
      cat.y = ny;
      cat.fleeAngle = a;
      cat.fleeLock = 18; // 18프레임 동안 같은 방향 유지
      if (Math.abs(Math.cos(a)) > Math.abs(Math.sin(a))) {
        cat.direction = Math.cos(a) > 0 ? 'right' : 'left';
      } else {
        cat.direction = Math.sin(a) > 0 ? 'down' : 'up';
      }
      escaped = true;
      break;
    }

    // 모든 방향이 막혀있으면 텔레포트
    if (!escaped) {
      let bestX = cat.x, bestY = cat.y, bestDist = 0;
      for (let i = 0; i < 20; i++) {
        const tx = 20 + Math.random() * (mapW - 60);
        const ty = 20 + Math.random() * (mapH - 60);
        if (checkCollisionForCat(tx, ty)) continue;
        const td = Math.sqrt((p.x - tx) ** 2 + (p.y - ty) ** 2);
        if (td > bestDist) {
          bestDist = td;
          bestX = tx;
          bestY = ty;
        }
      }
      cat.x = bestX;
      cat.y = bestY;
      cat.fleeLock = 0;
      cat.direction = 'down';
    }
    return;
  }

  cat.fleeing = false;

  // 하루가 멀리 있으면 가만히 있기
  const idleDist = 150;
  if (dist > idleDist) {
    cat.moving = false;
    return;
  }

  // 일반 모드 - 대부분 가만히 있음
  if (cat.waitTimer > 0) {
    cat.waitTimer--;
    cat.moving = false;
    return;
  }

  if (!cat.moving) {
    // 90% 확률로 그냥 계속 대기
    if (Math.random() < 0.9) {
      cat.waitTimer = 200 + Math.floor(Math.random() * 300);
      return;
    }
    cat.targetX = 20 + Math.random() * (mapW - 60);
    cat.targetY = 20 + Math.random() * (mapH - 60);
    cat.moving = true;
  }

  const tdx = cat.targetX - cat.x;
  const tdy = cat.targetY - cat.y;

  if (Math.abs(tdx) < 3 && Math.abs(tdy) < 3) {
    cat.moving = false;
    cat.waitTimer = 90 + Math.floor(Math.random() * 150);
    return;
  }

  // 한 축씩 이동
  if (Math.abs(tdx) > 3) {
    const nx = cat.x + (tdx > 0 ? cat.speed : -cat.speed) * dt;
    if (!checkCollisionForCat(nx, cat.y)) cat.x = nx;
    cat.direction = tdx > 0 ? 'right' : 'left';
  } else {
    const ny = cat.y + (tdy > 0 ? cat.speed : -cat.speed) * dt;
    if (!checkCollisionForCat(cat.x, ny)) cat.y = ny;
    cat.direction = tdy > 0 ? 'down' : 'up';
  }
}

// 고양이 전용 충돌 체크 (NPC 충돌 제외, 벽/나무만)
function checkCollisionForCat(x, y) {
  const cat = game.cat;
  const mapW = game.mapCols * game.tileSize;
  const mapH = game.mapRows * game.tileSize;
  if (x < 0 || y < 0 || x + cat.width > mapW || y + cat.height > mapH) return true;
  for (const c of game.colliders) {
    if (x < c.x + c.w && x + cat.width > c.x && y < c.y + c.h && y + cat.height > c.y) {
      return true;
    }
  }
  return false;
}

// 정원 영역 (NPC 이동 범위)
const GARDEN = { left: 96, top: 160, right: 316, bottom: 300 };

// NPC끼리, NPC-플레이어 충돌 체크
function checkNpcCollision(npc, nx, ny) {
  const p = game.player;
  const pad = 4; // 여유 간격
  // 플레이어와 충돌
  if (nx < p.x + p.width + pad && nx + npc.width + pad > p.x &&
      ny < p.y + p.height + pad && ny + npc.height + pad > p.y) {
    return true;
  }
  // 다른 NPC와 충돌
  for (const other of game.npcs) {
    if (other.id === npc.id) continue;
    if (nx < other.x + other.width + pad && nx + npc.width + pad > other.x &&
        ny < other.y + other.height + pad && ny + npc.height + pad > other.y) {
      return true;
    }
  }
  return false;
}

// NPC 이동 AI
function updateNpcs() {
  if (DialogSystem.active) return;

  game.npcs.forEach(npc => {
    const ai = npc.ai;

    // 대기 중이면 타이머 감소
    if (ai.waitTimer > 0) {
      ai.waitTimer--;
      ai.moving = false;
      return;
    }

    // 새 목적지 설정
    if (!ai.moving) {
      ai.targetX = GARDEN.left + Math.random() * (GARDEN.right - GARDEN.left - npc.width);
      ai.targetY = GARDEN.top + Math.random() * (GARDEN.bottom - GARDEN.top - npc.height);
      ai.moving = true;
    }

    // 목적지로 이동 (한 축씩만)
    const dx = ai.targetX - npc.x;
    const dy = ai.targetY - npc.y;

    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      ai.moving = false;
      ai.waitTimer = 120 + Math.floor(Math.random() * 180);
      return;
    }

    let nx = npc.x;
    let ny = npc.y;
    const dt = game.dt;

    // X축 먼저, 도착하면 Y축
    if (Math.abs(dx) > 2) {
      nx += (dx > 0 ? npc.speed : -npc.speed) * dt;
      npc.direction = dx > 0 ? 'right' : 'left';
    } else {
      ny += (dy > 0 ? npc.speed : -npc.speed) * dt;
      npc.direction = dy > 0 ? 'down' : 'up';
    }

    // 충돌 시 멈추고 새 목적지 탐색
    if (checkNpcCollision(npc, nx, ny)) {
      ai.moving = false;
      ai.waitTimer = 30 + Math.floor(Math.random() * 60);
      return;
    }

    npc.x = nx;
    npc.y = ny;
  });
}

// 조이스틱 상태
const joystick = { active: false, dx: 0, dy: 0 };

// 터치 컨트롤 (가상 조이스틱)
function setupTouchControls() {
  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  if (!zone || !knob) return;

  const maxDist = 36; // 노브 최대 이동 거리
  let touchId = null;
  let baseX = 0, baseY = 0;

  function getCenter() {
    const rect = zone.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function handleMove(cx, cy) {
    const center = getCenter();
    let dx = cx - center.x;
    let dy = cy - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }

    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    // 데드존 (8px 이내면 무시)
    if (dist < 8) {
      joystick.dx = 0;
      joystick.dy = 0;
      return;
    }

    // -1 ~ 1 범위로 정규화
    joystick.dx = dx / maxDist;
    joystick.dy = dy / maxDist;
  }

  function resetKnob() {
    knob.style.transform = 'translate(-50%, -50%)';
    joystick.active = false;
    joystick.dx = 0;
    joystick.dy = 0;
    touchId = null;
  }

  // 터치 이벤트
  zone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (touchId !== null) return;
    const t = e.changedTouches[0];
    touchId = t.identifier;
    joystick.active = true;
    handleMove(t.clientX, t.clientY);
  }, { passive: false });

  zone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        handleMove(t.clientX, t.clientY);
        break;
      }
    }
  }, { passive: false });

  zone.addEventListener('touchend', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) { resetKnob(); break; }
    }
  });

  zone.addEventListener('touchcancel', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) { resetKnob(); break; }
    }
  });

  // 마우스 이벤트
  let mouseDown = false;

  zone.addEventListener('mousedown', (e) => {
    e.preventDefault();
    mouseDown = true;
    joystick.active = true;
    handleMove(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    handleMove(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    resetKnob();
  });

  // 대화 버튼
  const actionBtn = document.getElementById('btn-action');
  if (actionBtn) {
    actionBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (DialogSystem.active) {
        DialogSystem.advance();
      } else {
        const npc = getNearbyNpc();
        if (npc) DialogSystem.start(npc.id);
      }
    }, { passive: false });

    actionBtn.addEventListener('click', () => {
      if (DialogSystem.active) {
        DialogSystem.advance();
      } else {
        const npc = getNearbyNpc();
        if (npc) DialogSystem.start(npc.id);
      }
    });
  }
}

setupTouchControls();

// 게임 루프 (delta time 기반 - 60fps 기준)
let lastTime = 0;
game.dt = 1; // delta time 배수 (1 = 60fps 기준)

function gameLoop(timestamp) {
  if (lastTime === 0) lastTime = timestamp;
  const elapsed = timestamp - lastTime;
  lastTime = timestamp;
  // 60fps 기준 delta time 배수 (16.667ms = 1프레임)
  game.dt = Math.min(elapsed / 16.667, 3); // 최대 3배로 제한 (탭 전환 등 방지)

  game.frame++;
  updatePlayer();
  updateNpcs();
  updateCat();
  updateBirds();
  updateCamera();
  Weather.update(game.frame);
  DayNight.update(game.frame);
  DialogSystem.update();
  render();
  requestAnimationFrame(gameLoop);
}

// 초기화 및 시작
I18n.init();
Music.init();
DayNight.init();
Weather.fetch();
initMap();
requestAnimationFrame(gameLoop);
