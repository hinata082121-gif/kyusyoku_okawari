import Phaser from 'phaser';
import { resultMessages } from '../data/resultMessages';
import type { LunchMenu, ResultType } from '../types';

export function pickMainCopy(resultType: ResultType, menu: LunchMenu): string {
  const message = resultMessages[resultType];
  return applyMenuName(Phaser.Math.RND.pick(message.mainCopies), menu);
}

export function buildShareCopy(resultType: ResultType, menu: LunchMenu, mainCopy?: string): string {
  const message = resultMessages[resultType];
  const baseCopy = mainCopy ?? Phaser.Math.RND.pick(message.shareCopies);
  const menuAwareCopy = applyMenuName(baseCopy, menu);

  return `「${menuAwareCopy}」\n#給食おかわり争奪戦\n#平成学校ゲームズ`;
}

export function pickShareLine(resultType: ResultType, menu: LunchMenu): string {
  const message = resultMessages[resultType];
  return applyMenuName(Phaser.Math.RND.pick(message.shareCopies), menu);
}

function applyMenuName(copy: string, menu: LunchMenu): string {
  if (copy.includes(menu.name)) return copy;
  if (copy.includes('プリン')) return copy.replaceAll('プリン', menu.name);
  if (copy.includes('カレー')) return copy.replaceAll('カレー', menu.name);
  if (copy.includes('揚げパン')) return copy.replaceAll('揚げパン', menu.name);
  if (copy.includes('一皿')) return copy.replace('一皿', `${menu.name}`);
  return copy;
}
