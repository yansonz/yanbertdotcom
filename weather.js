// 날씨 시스템 - Open-Meteo API 기반
const Weather = {
  temperature: null,
  weatherCode: null,
  condition: 'clear',
  particles: [],
  loaded: false,
  overlay: { r: 0, g: 0, b: 0, a: 0 },
  windSpeed: 0,
  windAngle: 0,
  sunrise: null, // HH:MM 형식
  sunset: null,  // HH:MM 형식

  // WMO 날씨 코드 → 상태 매핑
  codeToCondition(code) {
    if (code === 0) return 'clear';
    if (code <= 3) return 'cloudy';
    if (code >= 45 && code <= 48) return 'fog';
    if (code >= 51 && code <= 57) return 'drizzle';
    if (code >= 61 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95) return 'storm';
    return 'clear';
  },

  // API에서 날씨 가져오기
  async fetch() {
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=37.5145&longitude=127.1059&current=temperature_2m,weathercode&daily=sunrise,sunset&timezone=Asia/Seoul';
      const res = await fetch(url);
      const data = await res.json();
      this.temperature = data.current.temperature_2m;
      this.weatherCode = data.current.weathercode;
      this.condition = this.codeToCondition(this.weatherCode);
      
      // sunrise/sunset 파싱 (ISO 형식 → HH:MM)
      if (data.daily && data.daily.sunrise && data.daily.sunset) {
        const sunriseDate = new Date(data.daily.sunrise[0]);
        const sunsetDate = new Date(data.daily.sunset[0]);
        this.sunrise = `${String(sunriseDate.getHours()).padStart(2, '0')}:${String(sunriseDate.getMinutes()).padStart(2, '0')}`;
        this.sunset = `${String(sunsetDate.getHours()).padStart(2, '0')}:${String(sunsetDate.getMinutes()).padStart(2, '0')}`;
      }
      
      this.loaded = true;
      this.setupEffects();
      this.updateInfoElement();
      
      // DayNight에 sunrise/sunset 전달
      if (typeof DayNight !== 'undefined' && this.sunrise && this.sunset) {
        DayNight.setSunTimes(this.sunrise, this.sunset);
      }
    } catch (e) {
      // 실패 시 기본값
      this.temperature = 15;
      this.condition = 'clear';
      this.loaded = true;
      this.setupEffects();
      this.updateInfoElement();
    }
  },

  // 날씨별 효과 설정
  setupEffects() {
    this.particles = [];

    switch (this.condition) {
      case 'rain':
      case 'drizzle':
      case 'storm':
        this.overlay = { r: 30, g: 40, b: 60, a: 0.25 };
        this.windSpeed = this.condition === 'storm' ? 3 : 1;
        this.windAngle = 0.3;
        for (let i = 0; i < (this.condition === 'storm' ? 150 : 80); i++) {
          this.particles.push(this.createRainDrop());
        }
        break;

      case 'snow':
        this.overlay = { r: 200, g: 210, b: 230, a: 0.15 };
        this.windSpeed = 0.5;
        this.windAngle = 0;
        for (let i = 0; i < 60; i++) {
          this.particles.push(this.createSnowflake());
        }
        break;

      case 'fog':
        this.overlay = { r: 180, g: 180, b: 190, a: 0.35 };
        for (let i = 0; i < 8; i++) {
          this.particles.push(this.createFogBank());
        }
        break;

      case 'cloudy':
        this.overlay = { r: 60, g: 60, b: 80, a: 0.2 };
        for (let i = 0; i < 5; i++) {
          this.particles.push(this.createCloud());
        }
        break;

      default:
        // 맑음 - 기온에 따라 색조 + 파티클
        if (this.temperature !== null) {
          if (this.temperature >= 30) {
            this.overlay = { r: 255, g: 120, b: 50, a: 0.08 };
            // 아지랑이 파티클
            for (let i = 0; i < 15; i++) {
              this.particles.push(this.createHeatWave());
            }
          } else if (this.temperature <= 0) {
            this.overlay = { r: 100, g: 150, b: 220, a: 0.1 };
            // 서리 반짝임 파티클
            for (let i = 0; i < 20; i++) {
              this.particles.push(this.createFrostSparkle());
            }
          } else {
            this.overlay = { r: 0, g: 0, b: 0, a: 0 };
            // 햇빛 먼지 파티클
            for (let i = 0; i < 12; i++) {
              this.particles.push(this.createSunMote());
            }
          }
        }
        break;
    }
  },

  createRainDrop() {
    return {
      x: Math.random() * 520,
      y: Math.random() * -450,
      speed: 4 + Math.random() * 4,
      length: 6 + Math.random() * 8
    };
  },

  createSnowflake() {
    return {
      x: Math.random() * 520,
      y: Math.random() * -450,
      speed: 0.5 + Math.random() * 1.5,
      size: 1 + Math.random() * 3,
      wobble: Math.random() * Math.PI * 2
    };
  },

  createCloud() {
    return {
      x: Math.random() * 600 - 100,
      y: 20 + Math.random() * 80,
      speed: 0.15 + Math.random() * 0.2,
      w: 80 + Math.random() * 60,
      h: 30 + Math.random() * 15,
      alpha: 0.25 + Math.random() * 0.15
    };
  },

  // 안개 덩어리
  createFogBank() {
    return {
      type: 'fog',
      x: Math.random() * 600 - 100,
      y: Math.random() * 450,
      speed: 0.08 + Math.random() * 0.12,
      w: 120 + Math.random() * 100,
      h: 50 + Math.random() * 40,
      alpha: 0.15 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2
    };
  },

  // 아지랑이 (더운 날)
  createHeatWave() {
    return {
      type: 'heat',
      x: Math.random() * 480,
      y: 350 + Math.random() * 80,
      speed: 0.3 + Math.random() * 0.3,
      w: 40 + Math.random() * 60,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.06 + Math.random() * 0.06
    };
  },

  // 서리 반짝임 (추운 날)
  createFrostSparkle() {
    return {
      type: 'frost',
      x: Math.random() * 480,
      y: Math.random() * 416,
      life: Math.random() * 200,
      maxLife: 200,
      size: 1 + Math.random() * 2
    };
  },

  // 햇빛 먼지 (맑은 날)
  createSunMote() {
    return {
      type: 'sun',
      x: Math.random() * 480,
      y: Math.random() * 416,
      speed: 0.1 + Math.random() * 0.2,
      size: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.3 + Math.random() * 0.3
    };
  },

  // 파티클 업데이트
  update(frame) {
    if (!this.loaded) return;

    this.particles.forEach(p => {
      if (p.w && !p.type) {
        // 구름 파티클
        p.x += p.speed;
        if (p.x > 540) p.x = -p.w;
      } else if (p.type === 'fog') {
        p.x += p.speed;
        p.phase += 0.01;
        p.y += Math.sin(p.phase) * 0.3;
        if (p.x > 540) p.x = -p.w;
      } else if (p.type === 'heat') {
        p.phase += 0.04;
        p.y -= p.speed;
        if (p.y < 200) { p.y = 380 + Math.random() * 50; p.x = Math.random() * 480; }
      } else if (p.type === 'frost') {
        p.life++;
        if (p.life > p.maxLife) { p.life = 0; p.x = Math.random() * 480; p.y = Math.random() * 416; }
      } else if (p.type === 'sun') {
        p.phase += 0.015;
        p.x += Math.sin(p.phase) * 0.3;
        p.y -= p.speed * 0.5;
        if (p.y < -10) { p.y = 420; p.x = Math.random() * 480; }
      } else if (this.condition === 'snow') {
        p.y += p.speed;
        p.wobble += 0.02;
        p.x += Math.sin(p.wobble) * 0.5 + this.windSpeed * 0.3;
        if (p.y > 450) {
          p.y = Math.random() * -50;
          p.x = Math.random() * 520;
        }
      } else {
        // 비
        p.y += p.speed;
        p.x += this.windSpeed;
        if (p.y > 450) {
          p.y = Math.random() * -50;
          p.x = Math.random() * 520;
        }
      }
    });
  },

  // 날씨 효과 렌더링 (카메라 변환 후 호출)
  render(ctx, camX, camY, width, height) {
    if (!this.loaded) return;

    ctx.save();

    // 파티클 렌더링
    if (this.condition === 'rain' || this.condition === 'drizzle' || this.condition === 'storm') {
      ctx.strokeStyle = 'rgba(180, 200, 230, 0.5)';
      ctx.lineWidth = 1;
      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + this.windAngle * p.length, p.y + p.length);
        ctx.stroke();
      });

      // 번개 (폭풍)
      if (this.condition === 'storm' && Math.random() < 0.005) {
        ctx.fillStyle = 'rgba(255, 255, 220, 0.3)';
        ctx.fillRect(0, 0, width, height);
      }
    }

    if (this.condition === 'snow') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 구름 렌더링
    if (this.condition === 'cloudy') {
      this.particles.forEach(p => {
        if (!p.w) return;
        ctx.fillStyle = `rgba(180, 185, 195, ${p.alpha})`;
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx - p.w * 0.25, cy - p.h * 0.15, p.w * 0.3, p.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + p.w * 0.2, cy - p.h * 0.1, p.w * 0.35, p.h * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 안개 렌더링
    if (this.condition === 'fog') {
      this.particles.forEach(p => {
        if (p.type !== 'fog') return;
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        const swell = 1 + Math.sin(p.phase) * 0.1;
        ctx.fillStyle = `rgba(210, 215, 220, ${p.alpha})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.w * swell / 2, p.h * swell / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 아지랑이 렌더링 (더운 날)
    this.particles.forEach(p => {
      if (p.type === 'heat') {
        const wave = Math.sin(p.phase) * 8;
        ctx.fillStyle = `rgba(255, 200, 100, ${p.alpha})`;
        ctx.beginPath();
        ctx.ellipse(p.x + wave, p.y, p.w / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 서리 반짝임 렌더링 (추운 날)
    this.particles.forEach(p => {
      if (p.type === 'frost') {
        const progress = p.life / p.maxLife;
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
        ctx.fillStyle = `rgba(200, 230, 255, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // 십자 반짝임
        ctx.strokeStyle = `rgba(220, 240, 255, ${alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size * 2, p.y);
        ctx.lineTo(p.x + p.size * 2, p.y);
        ctx.moveTo(p.x, p.y - p.size * 2);
        ctx.lineTo(p.x, p.y + p.size * 2);
        ctx.stroke();
      }
    });

    // 햇빛 먼지 렌더링 (맑은 날)
    this.particles.forEach(p => {
      if (p.type === 'sun') {
        const flicker = 0.5 + Math.sin(p.phase * 3) * 0.5;
        ctx.fillStyle = `rgba(255, 240, 180, ${p.alpha * flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 오버레이
    if (this.overlay.a > 0) {
      ctx.fillStyle = `rgba(${this.overlay.r}, ${this.overlay.g}, ${this.overlay.b}, ${this.overlay.a})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  },

  // 기온 표시 텍스트
  getInfoText() {
    if (!this.loaded || this.temperature === null) return '';
    const condNames = {
      ko: { clear: '맑음', cloudy: '흐림', fog: '안개', drizzle: '이슬비', rain: '비', snow: '눈', storm: '폭풍' },
      en: { clear: 'Clear', cloudy: 'Cloudy', fog: 'Foggy', drizzle: 'Drizzle', rain: 'Rain', snow: 'Snow', storm: 'Storm' }
    };
    const lang = typeof I18n !== 'undefined' ? I18n.lang : 'en';
    const name = condNames[lang][this.condition] || this.condition;
    const location = typeof I18n !== 'undefined' ? I18n.get('location') : 'Seoul';
    return `${location} ${this.temperature}°C ${name}`;
  },

  // HTML 요소에 날씨 정보 표시
  updateInfoElement() {
    const el = document.getElementById('weather-info');
    if (!el) return;
    const text = this.getInfoText();
    if (text) {
      el.textContent = text;
      el.style.display = 'block';
    }
  }
};
