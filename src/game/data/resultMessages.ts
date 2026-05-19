import type { ResultMessage, ResultType } from '../types';

export const resultMessages: Record<ResultType, ResultMessage> = {
  success: {
    title: 'おかわり成功！',
    badge: '給食の勝者',
    mainCopies: [
      '今日の給食、優勝。',
      'おかわり成功。完全勝利。',
      'この一皿は、努力の味。',
    ],
    shareCopies: [
      'カレーおかわり成功。今日の給食、優勝。',
      '揚げパン獲得。これは完全勝利。',
      '給食の勝者になりました。',
    ],
    teacherLine: 'よかったね',
    serverLine: 'どうぞ！',
    visualMood: 'victory',
  },
  lastOneSuccess: {
    title: '最後の1個、獲得！',
    badge: 'クラスの英雄',
    mainCopies: [
      '最後のプリン、取った。',
      'じゃんけんに勝って、全てを手に入れた。',
      'この勝利は語り継がれる。',
    ],
    shareCopies: [
      '最後のプリン、取った。',
      '今日、クラスの英雄になった。',
      'この勝利は語り継がれる。',
      'じゃんけんに勝って、全てを手に入れた。',
    ],
    teacherLine: 'ほどほどにね',
    serverLine: '最後の1個です',
    visualMood: 'lastOneVictory',
  },
  soldOut: {
    title: '売り切れ',
    badge: 'あと1人早ければ…',
    mainCopies: [
      'プリン、目の前で消えた。',
      '給食台には、もう何もなかった。',
      'あと1人早ければ、未来は変わっていた。',
    ],
    shareCopies: [
      'プリン、目の前で消えた。',
      'あと1人早ければ、未来は変わっていた。',
      '給食台には、もう何もなかった。',
      '今日は運がなかった。',
    ],
    teacherLine: 'また次ね',
    serverLine: 'もうありません',
    visualMood: 'soldOut',
  },
  jankenLose: {
    title: 'じゃんけん敗北',
    badge: 'グーを出せばよかった',
    mainCopies: [
      'じゃんけんで全てを失った。',
      'プリンは友達の手に渡った。',
      'あいこにしたかった人生だった。',
    ],
    shareCopies: [
      'じゃんけんで全てを失った。',
      'グーを出せばよかった。',
      'プリンは友達の手に渡った。',
      'あいこにしたかった人生だった。',
    ],
    teacherLine: 'また次ね',
    serverLine: '次の人どうぞ',
    visualMood: 'jankenLose',
  },
  flying: {
    title: 'フライング',
    badge: 'まだ“いただきます”前',
    mainCopies: [
      '先生に止められた。',
      'おかわりへの気持ちが早すぎた。',
      'まだ“いただきます”前だった。',
    ],
    shareCopies: [
      'まだ“いただきます”前だった。',
      'おかわりへの気持ちが早すぎた。',
      '先生に止められた。',
    ],
    teacherLine: 'まだです！',
    serverLine: '合図の後でね',
    visualMood: 'flying',
  },
};
