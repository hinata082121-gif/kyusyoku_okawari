import Phaser from 'phaser';
import { COLORS } from '../constants';
import type { LunchMenu, LunchMenuId } from '../types';

export const lunchMenus: Record<LunchMenuId, LunchMenu> = {
  curry: {
    id: 'curry',
    name: 'カレー',
    popularity: 86,
    remainingServings: 4,
    timingDifficulty: 'normal',
    jankenRate: 0.45,
    introText: 'カレーの日は、教室が少し本気になる。',
    successCopy: 'カレーおかわり成功。今日の給食、優勝。',
    failCopy: 'カレー、目の前で消えた。',
    color: COLORS.orange,
    accentColor: COLORS.yellow,
    menuLineup: ['カレー', '牛乳', 'サラダ', 'フルーツ'],
  },
  agepan: {
    id: 'agepan',
    name: '揚げパン',
    popularity: 90,
    remainingServings: 3,
    timingDifficulty: 'hard',
    jankenRate: 0.5,
    introText: '揚げパン戦争、開幕。',
    successCopy: '揚げパン獲得。これは完全勝利。',
    failCopy: '揚げパン戦争、敗北。',
    color: COLORS.wood,
    accentColor: COLORS.yellow,
    menuLineup: ['揚げパン', '牛乳', 'ポトフ', 'みかん'],
  },
  pudding: {
    id: 'pudding',
    name: 'プリン',
    popularity: 100,
    remainingServings: 2,
    timingDifficulty: 'normal',
    jankenRate: 0.85,
    introText: '最後のプリンをめぐる、静かな戦争。',
    successCopy: '最後のプリン、取った。',
    failCopy: 'プリン、目の前で消えた。',
    color: COLORS.yellow,
    accentColor: COLORS.red,
    menuLineup: ['わかめご飯', '牛乳', 'からあげ', 'プリン'],
  },
};

export const menuIds = Object.keys(lunchMenus) as LunchMenuId[];

export function getRandomMenu(): LunchMenu {
  const id = Phaser.Math.RND.pick(menuIds);
  return lunchMenus[id];
}
