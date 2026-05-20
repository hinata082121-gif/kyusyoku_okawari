import Phaser from 'phaser';
import { rarityLabels } from '../data/menus';
import { resultMessages } from '../data/resultMessages';
import type { LunchMenu, ResultType } from '../types';

export function pickMainCopy(resultType: ResultType, menu: LunchMenu): string {
  if (resultType === 'success' || resultType === 'lastOneSuccess') {
    const rarityCopy = getRarityMainCopies(menu);
    if (rarityCopy.length > 0) return Phaser.Math.RND.pick(rarityCopy);
  }
  const message = resultMessages[resultType];
  return applyMenuName(Phaser.Math.RND.pick(message.mainCopies), menu);
}

export function buildShareCopy(resultType: ResultType, menu: LunchMenu, mainCopy?: string): string {
  const message = resultMessages[resultType];
  const baseCopy = getRarityShareCopy(resultType, menu) ?? mainCopy ?? Phaser.Math.RND.pick(message.shareCopies);
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

function getRarityMainCopies(menu: LunchMenu): string[] {
  if (menu.rarity === 'rare') {
    return ['レア給食、獲得。', 'これは給食史に残る一皿。'];
  }
  if (menu.rarity === 'superRare') {
    return ['激レア給食、勝ち取った。', '今日だけの特別メニューを手に入れた。'];
  }
  if (menu.rarity === 'legendary') {
    return ['伝説の給食、降臨。', 'これはもう給食ではなく事件。', 'クラス中が、その勝利を目撃した。'];
  }
  return [];
}

function getRarityShareCopy(resultType: ResultType, menu: LunchMenu): string | undefined {
  if (resultType !== 'success' && resultType !== 'lastOneSuccess') return undefined;
  if (menu.rarity === 'legendary') return `伝説メニュー『${menu.name}』を勝ち取った。`;
  if (menu.rarity === 'superRare') return `激レア給食『${menu.name}』をコレクションに登録！`;
  if (menu.rarity === 'rare') return `レア給食『${menu.name}』を獲得。`;
  return `${rarityLabels[menu.rarity]}給食『${menu.name}』をおかわり成功。`;
}
