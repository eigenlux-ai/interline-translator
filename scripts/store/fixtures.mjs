// Original sample copy, served locally. The extension supplies every translation and control.
export const locales = {
  zh_CN: {
    ui: 'zh',
    target: 'zh-CN',
    title: '读懂世界，留在原文里。',
    sub: '整页双语对照 · 划词翻译 · 输入框翻译',
    labels: [
      '原文与译文，就在同一页。',
      '选中一句，读懂它的意思。',
      '免费开始，也能接入你的 AI。',
      '写下想法，让语言跟上。',
      '你的阅读方式，你来决定。',
    ],
    details: [
      '逐段对照阅读，保留原网页的阅读脉络。',
      '在当前页面查看译文，随时复制或朗读。',
      '内置免 Key 引擎；自备密钥可添加大模型服务商。',
      '在输入框中连按三次空格，原地翻译草稿。',
      '深色外观、翻译风格与术语表，按需设置。',
    ],
    open: '代码完全开源 · MIT',
    write: '感谢你的建议！我会补充一个更清晰的示例。',
  },
  global: {
    ui: 'en',
    target: 'en',
    title: 'Read beyond language.',
    sub: 'Bilingual pages · Selected text · In-place writing',
    labels: [
      'Two languages. One reading flow.',
      'Select a sentence. Find its meaning.',
      'Start free. Bring your own AI.',
      'Your words, in another language.',
      'Make room for your reading style.',
    ],
    details: [
      'Keep the original and translation together, paragraph by paragraph.',
      'Read, copy or listen to a translation without leaving the page.',
      'A built-in key-free engine, plus your choice of AI providers.',
      'Press Space three times to translate a draft right where you write.',
      'Dark appearance, translation styles and a glossary you control.',
    ],
    open: 'Fully open source · MIT',
    write: 'Merci pour votre suggestion ! Je vais ajouter un exemple plus clair.',
  },
  ja: {
    ui: 'ja',
    target: 'ja',
    title: '原文のそばで、世界を読む。',
    sub: 'ページ全体の対訳 · 選択範囲の翻訳 · 入力欄の翻訳',
    labels: [
      '原文と訳文を、同じページで。',
      '気になる一文を、その場で理解。',
      '無料で始めて、AI も選べる。',
      '伝えたいことを、別の言語で。',
      '自分に合った読み方を。',
    ],
    details: [
      '段落ごとの対訳で、文章の流れを保ちながら読めます。',
      'ページを離れずに翻訳を確認。コピーや読み上げにも対応。',
      'キー不要の翻訳エンジンを内蔵。自分の API キーで AI も利用可能。',
      '入力欄でスペースを3回押すと、下書きをその場で翻訳。',
      'ダーク表示、翻訳スタイル、用語集を自分好みに。',
    ],
    open: 'コードをすべて公開 · MIT',
    write: 'ご提案ありがとうございます！より分かりやすい例を追加します。',
  },
  ko: {
    ui: 'ko',
    target: 'ko',
    title: '원문 곁에서, 더 넓은 세상을.',
    sub: '페이지 전체 이중 언어 읽기 · 선택 번역 · 입력창 번역',
    labels: [
      '원문과 번역을 한 페이지에서.',
      '궁금한 문장을 바로 이해하세요.',
      '무료로 시작하고, AI도 선택하세요.',
      '전하고 싶은 말을 다른 언어로.',
      '나에게 맞는 읽기 방식.',
    ],
    details: [
      '문단별로 원문과 번역을 함께 읽으며 글의 흐름을 이어가세요.',
      '페이지를 떠나지 않고 번역을 읽고, 복사하고, 들어보세요.',
      '키 없이 쓰는 기본 엔진과 내 API 키로 연결하는 AI 제공업체.',
      '입력창에서 스페이스를 세 번 누르면 초안이 바로 번역됩니다.',
      '다크 모드, 번역 스타일, 용어집을 원하는 대로 설정하세요.',
    ],
    open: '전체 코드 오픈 소스 · MIT',
    write: '제안해 주셔서 감사합니다! 더 명확한 예시를 추가하겠습니다.',
  },
};
export function sampleHtml(locale, mode = 'article') {
  const l = locales[locale];
  const french = locale === 'global';
  const title = french ? 'Lire pour comprendre' : 'A slower way to read';
  const paras = french
    ? [
        'Lire dans une autre langue ouvre de nouvelles perspectives. Garder le texte et sa traduction côte à côte aide à suivre les nuances.',
        'Une bonne traduction laisse place à la curiosité. Comparez les mots, puis revenez au texte avec une idée plus précise.',
        'Un outil ouvert invite chacun à participer. Une question, une idée ou une contribution peut améliorer la lecture pour tous.',
      ]
    : [
        'Reading in another language opens up new perspectives. Keeping the original beside its translation helps you notice the details without losing your place.',
        'A good translation leaves room for curiosity. Select a sentence, compare the words, and return to the page with a clearer understanding.',
        'Open-source tools invite us to take part. A question, an idea, or a small contribution can make reading better for everyone.',
      ];
  return `<!doctype html><html lang="${french ? 'fr' : 'en'}"><meta charset="utf-8"><title>Reading notes — Interline sample</title><style>
  *{box-sizing:border-box}body{margin:0;background:#fffdf8;color:#29251e;font-family:Georgia,'Songti SC',serif;font-size:18px;line-height:1.65}header{margin:0 52px;padding:22px 0 14px;border-bottom:1px solid #e7e1d8;font:12px system-ui;letter-spacing:2px;color:#817565}article{margin:26px 52px;max-width:690px}h1{font-size:30px;line-height:1.25;margin:0 0 24px;font-weight:500}p{margin:14px 0}aside{position:absolute;right:42px;top:104px;width:210px;border-top:2px solid #b83e2c;padding-top:16px;font:13px/1.7 system-ui;color:#7c7164}textarea + .hint{margin-top:36px}textarea{display:block;width:100%;height:150px;border:1px solid #d7cbbb;border-radius:9px;background:#fffdf8;color:#29251e;font:19px/1.7 system-ui;padding:20px;resize:none}label{display:block;font:13px system-ui;color:#817565;margin:25px 0 12px}.hint{font:13px/1.6 system-ui;color:#817565}button.host{border:0;border-radius:7px;padding:12px 22px;background:#302b23;color:#fff;font:14px system-ui;margin-top:16px}
  </style><header translate="no">FIELD NOTES &nbsp; / &nbsp; READING & LANGUAGE</header>${mode === 'input' ? `<article translate="no"><h1>Join the conversation</h1><p class="hint">A local sample discussion · Your draft stays here until you choose to post.</p><label for="draft">Your reply</label><textarea id="draft" spellcheck="false"></textarea><p class="hint">Space × 3 &nbsp; → &nbsp; English<br>Interline · In-place input translation</p><button class="host">Post reply</button></article><aside translate="no">ORIGINAL DRAFT<br><br>${l.write}</aside>` : `<article><h1 translate="no">${title}</h1>${paras.map((p, i) => `<p id="p${i}">${p}</p>`).join('')}</article><aside translate="no">READING NOTES<br><br>A short original essay<br>for the Interline demo.<br><br>Text only. No account.<br>Stay curious.</aside>`}</html>`;
}
