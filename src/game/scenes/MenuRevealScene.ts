import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_WIDTH, SceneKeys } from '../constants';
import { getRandomMenu } from '../data/menus';
import type { GameState, LunchMenu } from '../types';
import { PixelPanel } from '../ui/PixelPanel';
import { drawMenuIcon } from '../ui/ResultCard';
import { trackMenuRevealed } from '../../lib/analytics';

export class MenuRevealScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.MenuReveal);
  }

  create(): void {
    const menu = getRandomMenu();
    const state: GameState = {
      selectedMenuId: menu.id,
      remainingServings: menu.remainingServings,
    };
    trackMenuRevealed(menu.name, menu.id);

    this.cameras.main.setBackgroundColor(0xf0c27a);
    drawMenuBoard(this, menu);

    this.add.text(GAME_WIDTH / 2, 464, menu.introText, {
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      color: '#172a4a',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 300 },
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 512, '教室がざわついた…', {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#25313f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.time.delayedCall(2600, () => this.scene.start(SceneKeys.Timing, state));
  }
}

function drawMenuBoard(scene: Phaser.Scene, menu: LunchMenu): void {
  new PixelPanel(scene, GAME_WIDTH / 2, 244, 314, 360, COLORS.board, COLORS.boardDark);
  scene.add.text(GAME_WIDTH / 2, 90, '今日の給食', {
    fontFamily: FONT_FAMILY,
    fontSize: '26px',
    color: '#f5ffe9',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  menu.menuLineup.forEach((line, index) => {
    scene.add.text(86, 138 + index * 38, `・${line}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      color: '#fff8e8',
      fontStyle: line === menu.name ? 'bold' : 'normal',
    }).setOrigin(0, 0.5);
  });

  scene.add.rectangle(GAME_WIDTH / 2, 318, 260, 72, COLORS.paper).setStrokeStyle(4, COLORS.black);
  scene.add.text(GAME_WIDTH / 2, 298, '本日の人気メニュー', {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    color: '#25313f',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  scene.add.text(GAME_WIDTH / 2, 330, menu.name, {
    fontFamily: FONT_FAMILY,
    fontSize: '34px',
    color: '#e84b4b',
    stroke: '#101820',
    strokeThickness: 5,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  drawMenuIcon(scene, GAME_WIDTH / 2, 392, menu.id, 1.45);
  scene.add.text(63, 420, '人気度', {
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    color: '#fff8e8',
    fontStyle: 'bold',
  }).setOrigin(0, 0.5);
  scene.add.rectangle(181, 420, 188, 18, COLORS.black);
  scene.add.rectangle(181 - 94 + (188 * menu.popularity) / 200, 420, (188 * menu.popularity) / 100, 12, menu.accentColor);
}
