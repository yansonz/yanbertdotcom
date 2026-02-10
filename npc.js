// NPC 대화 시스템
const DialogSystem = {
  active: false,
  currentNpc: null,
  dialogIndex: 0,
  textIndex: 0,
  currentText: '',
  typingSpeed: 3,
  frameCount: 0,

  // NPC 색상
  colors: {
    yan: '#4488cc',
    robert: '#e87aa4',
    mailbox: '#4a7abc'
  },

  // i18n에서 NPC 데이터 가져오기
  getNpcDialog(npcId) {
    const data = I18n.getNpcData(npcId);
    return {
      name: data.name,
      color: this.colors[npcId],
      lines: data.lines
    };
  },

  // 대화 시작
  start(npcId) {
    if (this.active) return;
    this.active = true;
    this.currentNpc = npcId;
    this.isHtml = (npcId === 'mailbox');
    const dialog = this.getNpcDialog(npcId);
    // 우편함은 순차, NPC는 랜덤
    this.dialogIndex = (npcId === 'mailbox') ? 0 : Math.floor(Math.random() * dialog.lines.length);
    this.textIndex = 0;
    this.currentText = '';
    this.frameCount = 0;
    this.show();
  },

  // 대화 진행 (Space 키)
  advance() {
    if (!this.active) return;

    const dialog = this.getNpcDialog(this.currentNpc);
    const fullText = dialog.lines[this.dialogIndex];
    const plainText = this.isHtml ? fullText.replace(/<[^>]*>/g, '') : fullText;

    if (this.currentText.length < plainText.length) {
      this.currentText = plainText;
      this.textIndex = plainText.length;
      const textEl = document.getElementById('dialog-text');
      if (this.isHtml) {
        textEl.innerHTML = fullText;
      } else {
        textEl.textContent = this.currentText;
      }
      return;
    }

    // 우편함은 다음 줄로 진행
    if (this.currentNpc === 'mailbox' && this.dialogIndex < dialog.lines.length - 1) {
      this.dialogIndex++;
      this.textIndex = 0;
      this.currentText = '';
      this.frameCount = 0;
      return;
    }

    this.close();
  },

  // 프레임 업데이트 (타이핑 효과)
  update() {
    if (!this.active) return;

    this.frameCount++;
    if (this.frameCount % this.typingSpeed !== 0) return;

    const dialog = this.getNpcDialog(this.currentNpc);
    const fullText = dialog.lines[this.dialogIndex];
    const plainText = this.isHtml ? fullText.replace(/<[^>]*>/g, '') : fullText;

    if (this.textIndex < plainText.length) {
      this.textIndex++;
      this.currentText = plainText.substring(0, this.textIndex);
      const textEl = document.getElementById('dialog-text');
      textEl.textContent = this.currentText;
      // 타이핑 완료 시 HTML 렌더링
      if (this.isHtml && this.textIndex >= plainText.length) {
        textEl.innerHTML = fullText;
      }
    }
  },

  // 대화창 표시
  show() {
    const dialog = this.getNpcDialog(this.currentNpc);
    const el = document.getElementById('dialog');
    const nameEl = document.getElementById('dialog-name');
    const textEl = document.getElementById('dialog-text');

    nameEl.textContent = dialog.name;
    nameEl.style.color = dialog.color;
    textEl.textContent = '';
    el.classList.remove('hidden');
  },

  // 대화창 닫기
  close() {
    this.active = false;
    this.currentNpc = null;
    document.getElementById('dialog').classList.add('hidden');
  }
};
