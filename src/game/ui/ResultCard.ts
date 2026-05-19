import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_WIDTH } from '../constants';
import { lunchMenus } from '../data/menus';
import type { GameState, LunchMenu, ResultType } from '../types';
import { resultMessages } from '../data/resultMessages';
import { PixelPanel } from './PixelPanel';

export class ResultCard extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, state: GameState, menu: LunchMenu, selectedMainCopy: string) {
    super(scene, GAME_WIDTH / 2, 276);
    const resultType = state.resultType ?? 'soldOut';
    const message = resultMessages[resultType];
    const theme = getResultTheme(resultType);

    const panel = new PixelPanel(scene, 0, 0, 324, 438, theme.panelColor, COLORS.black);
    panel.setDepth(-1);
    this.add(panel);

    const title = scene.add
      .text(0, -188, message.title, {
        fontFamily: FONT_FAMILY,
        fontSize: resultType === 'lastOneSuccess' ? '27px' : '31px',
        color: theme.titleText,
        stroke: '#101820',
        strokeThickness: 5,
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0.5);
    const menuLabel = scene.add
      .text(0, -150, menu.name, {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        color: '#172a4a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const badge = scene.add
      .text(0, -154, message.badge, {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        color: theme.badgeText,
        backgroundColor: theme.badgeBg,
        padding: { x: 12, y: 5 },
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    badge.setY(-118);

    this.add([title, menuLabel, badge]);
    this.drawResultIllustration(scene, resultType, menu);

    const quoteMarkTop = scene.add.text(-142, 120, '「', {
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      color: '#25313f',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const mainCopyText = scene.add
      .text(0, 126, selectedMainCopy, {
        fontFamily: FONT_FAMILY,
        fontSize: '19px',
        color: '#172a4a',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 280 },
      })
      .setOrigin(0.5);
    const quoteMarkBottom = scene.add.text(142, 132, '」', {
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      color: '#25313f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const shareLabel = scene.add
      .text(0, 158, 'シェア用コピー', {
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#25313f',
        padding: { x: 8, y: 3 },
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const shareCopy = scene.add
      .text(0, 188, state.shareCopy ?? '', {
        fontFamily: FONT_FAMILY,
        fontSize: '11px',
        color: '#25313f',
        align: 'center',
        lineSpacing: 3,
        wordWrap: { width: 284 },
      })
      .setOrigin(0.5);

    this.add([quoteMarkTop, mainCopyText, quoteMarkBottom, shareLabel, shareCopy]);
    scene.add.existing(this);
  }

  private drawResultIllustration(scene: Phaser.Scene, resultType: ResultType, menu: LunchMenu): void {
    const message = resultMessages[resultType];
    const success = resultType === 'success' || resultType === 'lastOneSuccess';
    const flying = resultType === 'flying';
    const lostByJanken = resultType === 'jankenLose';

    if (success) {
      for (let i = 0; i < 18; i += 1) {
        const angle = (Math.PI * 2 * i) / 18;
        const sparkle = scene.add.star(Math.cos(angle) * 115, -24 + Math.sin(angle) * 62, 4, 4, resultType === 'lastOneSuccess' ? 12 : 9, menu.accentColor);
        sparkle.setAngle(i * 10);
        scene.tweens.add({
          targets: sparkle,
          alpha: { from: 0.45, to: 1 },
          scale: { from: 0.75, to: 1.15 },
          duration: 600,
          yoyo: true,
          repeat: -1,
          delay: i * 35,
        });
        this.add(sparkle);
      }
    }

    const table = scene.add.rectangle(0, 72, 256, 34, COLORS.wood);
    table.setStrokeStyle(3, COLORS.black);
    this.add(table);

    this.add(drawCharacter(scene, -84, 30, success ? 'win' : lostByJanken ? 'down' : flying ? 'freeze' : 'shock', COLORS.blue));
    this.add(drawCharacter(scene, 82, 34, success ? 'clap' : 'win', COLORS.green));
    this.add(drawCharacter(scene, 0, 18, 'teacher', COLORS.purple));

    const plate = scene.add.ellipse(0, 64, 76, 20, COLORS.tray);
    plate.setStrokeStyle(3, COLORS.trayDark);
    this.add(plate);

    if (success) {
      this.add(drawMenuIcon(scene, -84, -26, menu.id, resultType === 'lastOneSuccess' ? 1.28 : 1.15));
      const arm = scene.add.rectangle(-68, -8, 12, 46, COLORS.blue);
      arm.setAngle(-28);
      arm.setStrokeStyle(2, COLORS.black);
      this.add(arm);
    } else if (flying) {
      const warning = scene.add.triangle(0, -56, 0, -34, -28, 20, 28, 20, COLORS.yellow);
      warning.setStrokeStyle(4, COLORS.red);
      const mark = scene.add.text(0, -48, '!', {
        fontFamily: FONT_FAMILY,
        fontSize: '46px',
        color: '#e84b4b',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const teacherLine = scene.add.text(0, -86, `先生「${message.teacherLine}」`, {
        fontFamily: FONT_FAMILY,
        fontSize: '13px',
        color: '#172a4a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add([teacherLine, warning, mark]);
    } else if (lostByJanken) {
      const hands = scene.add.text(0, -54, 'グー  チョキ  パー', {
        fontFamily: FONT_FAMILY,
        fontSize: '17px',
        color: '#172a4a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const teacherLine = scene.add.text(0, -82, `先生「${message.teacherLine}」`, {
        fontFamily: FONT_FAMILY,
        fontSize: '13px',
        color: '#172a4a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add([teacherLine, hands]);
      this.add(drawMenuIcon(scene, 82, -26, menu.id, 1.05));
    } else {
      const serverLine = scene.add.text(0, -78, `配膳係「${message.serverLine}」`, {
        fontFamily: FONT_FAMILY,
        fontSize: '13px',
        color: '#172a4a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const empty = scene.add.text(0, 62, '空', {
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        color: '#8895a3',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add([serverLine, empty]);
      this.add(drawMenuIcon(scene, 102, -10, menu.id, 0.8));
    }
  }
}

export function drawMenuIcon(
  scene: Phaser.Scene,
  x: number,
  y: number,
  menuId: keyof typeof lunchMenus,
  scale = 1,
): Phaser.GameObjects.Container {
  const menu = lunchMenus[menuId];
  const container = scene.add.container(x, y);
  if (menuId === 'curry') {
    const plate = scene.add.ellipse(0, 10, 54 * scale, 24 * scale, COLORS.tray);
    const rice = scene.add.circle(-10 * scale, 5 * scale, 13 * scale, COLORS.paper);
    const roux = scene.add.rectangle(10 * scale, 8 * scale, 24 * scale, 15 * scale, menu.color);
    roux.setStrokeStyle(2, COLORS.black);
    container.add([plate, rice, roux]);
  } else if (menuId === 'agepan') {
    const bread = scene.add.rectangle(0, 6, 58 * scale, 20 * scale, menu.color);
    bread.setStrokeStyle(3, COLORS.black);
    const sugar = scene.add.rectangle(0, -1, 48 * scale, 5 * scale, COLORS.cream);
    container.add([bread, sugar]);
  } else {
    const cup = scene.add.rectangle(0, 8, 34 * scale, 30 * scale, menu.color);
    cup.setStrokeStyle(3, COLORS.black);
    const caramel = scene.add.rectangle(0, -8, 38 * scale, 9 * scale, 0xb86a2f);
    caramel.setStrokeStyle(2, COLORS.black);
    container.add([cup, caramel]);
  }
  return container;
}

export function drawCharacter(
  scene: Phaser.Scene,
  x: number,
  y: number,
  pose: 'idle' | 'win' | 'shock' | 'clap' | 'teacher' | 'down' | 'freeze',
  color: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y);
  const head = scene.add.circle(0, -36, 13, 0xffd9b5);
  head.setStrokeStyle(3, COLORS.black);
  const hair = scene.add.rectangle(0, -47, 25, 9, COLORS.ink);
  hair.setStrokeStyle(2, COLORS.black);
  const body = scene.add.rectangle(0, -10, 28, 36, color);
  body.setStrokeStyle(3, COLORS.black);
  const eyeL = scene.add.rectangle(-5, -37, 3, 3, COLORS.black);
  const eyeR = scene.add.rectangle(5, -37, 3, 3, COLORS.black);

  const leftArm = scene.add.rectangle(-19, -14, 8, 28, 0xffd9b5);
  const rightArm = scene.add.rectangle(19, -14, 8, 28, 0xffd9b5);
  const legL = scene.add.rectangle(-8, 15, 9, 22, COLORS.navy);
  const legR = scene.add.rectangle(8, 15, 9, 22, COLORS.navy);
  [leftArm, rightArm, legL, legR].forEach((part) => part.setStrokeStyle(2, COLORS.black));

  if (pose === 'win') {
    leftArm.setAngle(-55).setPosition(-18, -25);
    rightArm.setAngle(55).setPosition(18, -25);
  } else if (pose === 'clap') {
    leftArm.setAngle(-75).setPosition(-12, -20);
    rightArm.setAngle(75).setPosition(12, -20);
  } else if (pose === 'shock' || pose === 'freeze') {
    leftArm.setAngle(25);
    rightArm.setAngle(-25);
  } else if (pose === 'down') {
    c.setAngle(-9);
    leftArm.setAngle(70).setPosition(-18, 0);
    rightArm.setAngle(-70).setPosition(18, 0);
  } else if (pose === 'teacher') {
    const glasses = scene.add.rectangle(0, -36, 22, 5, COLORS.white, 0.65);
    glasses.setStrokeStyle(1, COLORS.black);
    c.add(glasses);
  }

  c.add([leftArm, rightArm, legL, legR, body, head, hair, eyeL, eyeR]);
  return c;
}

function getResultTheme(resultType: ResultType): {
  panelColor: number;
  badgeBg: string;
  badgeText: string;
  titleText: string;
} {
  if (resultType === 'success' || resultType === 'lastOneSuccess') {
    return { panelColor: 0xfff1b8, badgeBg: '#e84b4b', badgeText: '#ffffff', titleText: '#fff3d6' };
  }
  if (resultType === 'flying') {
    return { panelColor: 0xffd6d6, badgeBg: '#172a4a', badgeText: '#ffffff', titleText: '#fffd9a' };
  }
  if (resultType === 'jankenLose') {
    return { panelColor: 0xe9defb, badgeBg: '#8b5adf', badgeText: '#ffffff', titleText: '#fff3d6' };
  }
  return { panelColor: 0xe5edf6, badgeBg: '#25313f', badgeText: '#ffffff', titleText: '#ffffff' };
}
