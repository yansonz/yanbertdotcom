// BGM 시스템 - Web Audio API 기반 모차르트 레퀴엠 스타일
const Music = {
  ctx: null,
  playing: false,
  muted: false,
  masterGain: null,
  tempo: 96,
  currentStep: 0,
  intervalId: null,

  // 음계 주파수 (D단조 기준)
  notes: {
    'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00,
    '-': 0
  },

  // 멜로디 (레퀴엠 Introitus 스타일 - D단조)
  melody: [
    'D4','D4','D4','D4', 'D4','Eb4','F4','F4',
    'F4','F4','E4','E4', 'D4','D4','-','-',
    'A4','A4','A4','A4', 'Bb4','A4','G4','G4',
    'F4','F4','E4','E4', 'D4','D4','-','-',
    'D4','E4','F4','G4', 'A4','A4','Bb4','A4',
    'G4','F4','E4','D4', 'E4','E4','D4','-',
    'F4','E4','D4','D4', 'C4','D4','E4','F4',
    'E4','D4','D4','-', 'D4','-','-','-',
  ],

  // 베이스 라인 (장엄한 오르간 스타일)
  bass: [
    'D3','D3','D3','D3', 'D3','D3','D3','D3',
    'A3','A3','A3','A3', 'D3','D3','D3','D3',
    'F3','F3','F3','F3', 'G3','G3','G3','G3',
    'A3','A3','A3','A3', 'D3','D3','D3','D3',
    'D3','D3','D3','D3', 'F3','F3','G3','G3',
    'Bb3','Bb3','A3','A3', 'A3','A3','D3','D3',
    'D3','D3','D3','D3', 'A3','A3','A3','A3',
    'A3','A3','D3','D3', 'D3','D3','D3','D3',
  ],

  init() {
    // 시작 오버레이 탭으로 AudioContext 초기화 (사파리 모바일 호환)
    const overlay = document.getElementById('start-overlay');
    if (!overlay) return;

    const startGame = (e) => {
      e.preventDefault();

      // AudioContext 생성 및 unlock
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
      }

      // 사파리 unlock: 무음 버퍼 재생
      const silent = this.ctx.createBuffer(1, 1, 22050);
      const src = this.ctx.createBufferSource();
      src.buffer = silent;
      src.connect(this.ctx.destination);
      src.start(0);

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          if (!this.playing) this.play();
        });
      } else {
        if (!this.playing) this.play();
      }

      // 오버레이 숨기기
      overlay.classList.add('hidden');
      overlay.removeEventListener('click', startGame);
      overlay.removeEventListener('touchend', startGame);
      document.removeEventListener('keydown', startGame);
    };

    overlay.addEventListener('click', startGame);
    overlay.addEventListener('touchend', startGame);
    document.addEventListener('keydown', startGame);
  },

  // 사각파 음 재생 (레트로 느낌)
  playNote(freq, duration, type, gainVal) {
    if (!this.ctx || freq === 0) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  },

  // 재생 시작
  play() {
    if (this.playing) return;
    this.playing = true;
    const stepDuration = 60 / this.tempo;

    this.intervalId = setInterval(() => {
      if (this.muted) return;
      const idx = this.currentStep % this.melody.length;

      // 멜로디 (사각파)
      const melNote = this.notes[this.melody[idx]];
      if (melNote) this.playNote(melNote, stepDuration * 0.8, 'square', 0.15);

      // 베이스 (삼각파, 2스텝마다)
      const bassIdx = idx;
      const bassNote = this.notes[this.bass[bassIdx]];
      if (bassNote && idx % 2 === 0) this.playNote(bassNote, stepDuration * 1.5, 'triangle', 0.2);

      this.currentStep++;
    }, stepDuration * 1000);
  },

  // 음소거 토글
  toggle() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.3;
    }
    const btn = document.getElementById('music-toggle');
    if (btn) btn.textContent = this.muted ? '🔇' : '🎵';
  },

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.playing = false;
  }
};
