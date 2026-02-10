// 낮/밤 시스템 - 서울 시간 기준
const DayNight = {
  phase: 'day',    // dawn, day, dusk, night
  hour: 12,
  overlay: { r: 0, g: 0, b: 0, a: 0 },
  stars: [],

  init() {
    this.updateTime();
    this.updateTimeDisplay();
    // 1분마다 시간 갱신
    setInterval(() => { this.updateTime(); this.updateTimeDisplay(); }, 60000);
    // 별 위치 미리 생성
    for (let i = 0; i < 30; i++) {
      this.stars.push({
        x: Math.random() * 480,
        y: Math.random() * 200,
        size: 0.5 + Math.random() * 1.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  },

  updateTime() {
    // KST (UTC+9)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const kst = new Date(utc + 9 * 3600000);
    this.hour = kst.getHours() + kst.getMinutes() / 60;

    if (this.hour >= 5 && this.hour < 7) {
      this.phase = 'dawn';
    } else if (this.hour >= 7 && this.hour < 17) {
      this.phase = 'day';
    } else if (this.hour >= 17 && this.hour < 19.5) {
      this.phase = 'dusk';
    } else {
      this.phase = 'night';
    }

    this.setupOverlay();
  },

  // KST 시간 표시 업데이트
  updateTimeDisplay() {
    const el = document.getElementById('time-info');
    if (!el) return;
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const kst = new Date(utc + 9 * 3600000);
    const h = String(kst.getHours()).padStart(2, '0');
    const m = String(kst.getMinutes()).padStart(2, '0');
    el.textContent = `🕐 ${h}:${m} KST`;
    el.style.display = 'block';
  },

  setupOverlay() {
    switch (this.phase) {
      case 'dawn':
        // 새벽 - 보라+주황 톤, 점점 밝아짐
        const dawnProgress = (this.hour - 5) / 2; // 0~1
        this.overlay = {
          r: 80 - dawnProgress * 60,
          g: 40 - dawnProgress * 30,
          b: 100 - dawnProgress * 80,
          a: 0.25 - dawnProgress * 0.2
        };
        break;
      case 'day':
        this.overlay = { r: 0, g: 0, b: 0, a: 0 };
        break;
      case 'dusk':
        // 석양 - 주황+붉은 톤, 점점 어두워짐
        const duskProgress = (this.hour - 17) / 2.5; // 0~1
        this.overlay = {
          r: 60 + duskProgress * 40,
          g: 20 + duskProgress * 10,
          b: 20 + duskProgress * 40,
          a: 0.05 + duskProgress * 0.3
        };
        break;
      case 'night':
        this.overlay = { r: 10, g: 10, b: 40, a: 0.4 };
        break;
    }
  },

  update(frame) {
    // 매 600프레임(~10초)마다 시간 갱신
    if (frame % 600 === 0) {
      this.updateTime();
      this.updateTimeDisplay();
    }
    // 별 반짝임
    this.stars.forEach(s => {
      s.twinkle += 0.03;
    });
  },

  render(ctx, width, height) {
    // 밤에 별 렌더링
    if (this.phase === 'night' || this.phase === 'dusk') {
      const starAlpha = this.phase === 'night' ? 0.8 : (this.hour - 17) / 2.5 * 0.5;
      this.stars.forEach(s => {
        const flicker = 0.4 + Math.sin(s.twinkle) * 0.6;
        ctx.fillStyle = `rgba(255, 255, 220, ${starAlpha * flicker})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 새벽에 수평선 그라데이션
    if (this.phase === 'dawn') {
      const grad = ctx.createLinearGradient(0, height * 0.6, 0, height);
      const p = (this.hour - 5) / 2;
      grad.addColorStop(0, `rgba(255, 150, 80, ${0.08 * (1 - p)})`);
      grad.addColorStop(1, `rgba(255, 100, 50, ${0.15 * (1 - p)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 석양 그라데이션
    if (this.phase === 'dusk') {
      const grad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      const p = (this.hour - 17) / 2.5;
      grad.addColorStop(0, `rgba(255, 100, 50, ${0.12 * p})`);
      grad.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 시간대 오버레이
    if (this.overlay.a > 0) {
      ctx.fillStyle = `rgba(${Math.round(this.overlay.r)}, ${Math.round(this.overlay.g)}, ${Math.round(this.overlay.b)}, ${this.overlay.a})`;
      ctx.fillRect(0, 0, width, height);
    }

    // 밤에 집 창문 불빛
    if (this.phase === 'night' || (this.phase === 'dusk' && this.hour > 18.5)) {
      ctx.fillStyle = 'rgba(255, 220, 100, 0.6)';
      // 창문 위치는 카메라 보정 필요 없음 (이미 월드 좌표에서 렌더링)
    }
  }
};
