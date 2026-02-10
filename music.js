// BGM 시스템 - Web Audio API 기반 레트로 RPG 음악
const Music = {
  ctx: null,
  playing: false,
  muted: false,
  masterGain: null,
  tempo: 140,
  currentStep: 0,
  intervalId: null,

  // 음계 주파수 (4옥타브 기준)
  notes: {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
    '-': 0
  },

  // 멜로디 (밝고 평화로운 정원 테마)
  melody: [
    'E4','G4','A4','G4', 'E4','D4','C4','D4',
    'E4','G4','A4','B4', 'A4','G4','E4','-',
    'C4','D4','E4','G4', 'A4','G4','E4','D4',
    'C4','E4','D4','C4', 'D4','E4','G4','-',
    'A4','G4','E4','D4', 'E4','G4','A4','B4',
    'C5','B4','A4','G4', 'E4','D4','C4','-',
    'E4','E4','D4','C4', 'D4','E4','G4','A4',
    'G4','E4','D4','E4', 'C4','-','C4','-',
  ],

  // 베이스 라인 (2스텝마다 1음)
  bass: [
    'C3','C3','G3','G3', 'A3','A3','E3','E3',
    'C3','C3','G3','G3', 'F3','F3','G3','G3',
    'C3','C3','E3','E3', 'F3','F3','G3','G3',
    'A3','A3','F3','F3', 'G3','G3','C3','C3',
    'F3','F3','G3','G3', 'A3','A3','E3','E3',
    'C3','C3','G3','G3', 'F3','F3','G3','G3',
    'C3','C3','A3','A3', 'F3','F3','G3','G3',
    'E3','E3','F3','F3', 'C3','C3','C3','C3',
  ],

  init() {
    // 사용자 인터랙션 후 초기화
    const start = () => {
      if (this.ctx) {
        // 이미 생성됐지만 suspended 상태일 수 있음 (사파리)
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            if (!this.playing) this.play();
          });
        }
        return;
      }
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);

      // 사파리 unlock: 무음 버퍼를 즉시 재생해야 AudioContext가 활성화됨
      const silent = this.ctx.createBuffer(1, 1, 22050);
      const src = this.ctx.createBufferSource();
      src.buffer = silent;
      src.connect(this.ctx.destination);
      src.start(0);

      // resume 후 play
      const doPlay = () => {
        if (!this.playing) this.play();
        removeListeners();
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(doPlay);
      } else {
        doPlay();
      }
    };

    const removeListeners = () => {
      document.removeEventListener('click', start);
      document.removeEventListener('keydown', start);
      document.removeEventListener('touchstart', start);
      document.removeEventListener('touchend', start);
    };

    document.addEventListener('click', start);
    document.addEventListener('keydown', start);
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchend', start, { passive: true });
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
