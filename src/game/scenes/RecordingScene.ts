import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../constants';
import { lunchMenus, rarityLabels } from '../data/menus';
import { drawCharacter, drawMenuIcon } from '../ui/ResultCard';
import { trackPromoView } from '../../lib/analytics';
import type { LunchMenu, LunchMenuId } from '../types';

type RecordingVariant = 'win' | 'lose' | 'random' | 'collection' | 'thumbnail';
type PlayableVariant = Exclude<RecordingVariant, 'random' | 'thumbnail'> | 'win' | 'lose';

const RECORDING_VARIANTS: RecordingVariant[] = ['win', 'lose', 'random', 'collection', 'thumbnail'];
const LEGENDARY_MENU_ID: LunchMenuId = 'jumboPudding';
const CTA_HASHTAGS = '#給食おかわり争奪戦\n#平成学校ゲームズ';
const trackedPromoVariants = new Set<RecordingVariant>();

export class RecordingScene extends Phaser.Scene {
  private requestedVariant: RecordingVariant = 'win';
  private playbackVariant: PlayableVariant = 'win';

  constructor() {
    super(SceneKeys.Recording);
  }

  init(data?: { variant?: string }): void {
    this.requestedVariant = isRecordingVariant(data?.variant) ? data.variant : getRecordingVariantFromUrl() ?? 'win';
    this.playbackVariant = this.requestedVariant === 'random'
      ? Phaser.Math.RND.pick(['win', 'lose'])
      : this.requestedVariant === 'thumbnail'
        ? 'win'
        : this.requestedVariant;
  }

  create(): void {
    if (!trackedPromoVariants.has(this.requestedVariant)) {
      trackedPromoVariants.add(this.requestedVariant);
      trackPromoView(this.requestedVariant);
    }
    this.input.setDefaultCursor('default');

    if (this.requestedVariant === 'thumbnail') {
      this.renderThumbnail();
      return;
    }

    if (this.playbackVariant === 'collection') {
      this.playCollectionTimeline();
      return;
    }

    if (this.playbackVariant === 'lose') {
      this.playLoseTimeline();
      return;
    }

    this.playWinTimeline();
  }

  private playWinTimeline(): void {
    this.schedule([
      [0, () => this.renderTitleFrame('最後のプリン、取れるか。', '平成学校ゲームズ 第二弾')],
      [2000, () => this.renderMenuRevealFrame()],
      [4500, () => this.renderLegendaryRevealFrame('伝説メニュー、降臨。', '出ただけで奇跡。')],
      [7000, () => this.renderTimingFrame('おかわり開始！', '早すぎるとフライング。\n遅すぎると売り切れ。', true)],
      [10000, () => this.renderJankenFrame('伝説メニューは、じゃんけんで決めます。', '早くても、最後はじゃんけん。')],
      [14000, () => this.renderWinFrame()],
      [17000, () => this.renderCtaFrame('あなたは、最後の一口を勝ち取れるか。', CTA_HASHTAGS)],
      [20500, () => this.restartWithFade()],
    ]);
  }

  private playLoseTimeline(): void {
    this.schedule([
      [0, () => this.renderTitleFrame('出ただけで奇跡。', '伝説メニュー、出現。')],
      [2000, () => this.renderLegendaryRevealFrame('幻のジャンボプリン', 'この一皿を、クラス全員が狙っている。')],
      [5000, () => this.renderTimingFrame('おかわり開始！', '完璧なスタート。\nでも……', true)],
      [8000, () => this.renderJankenFrame('伝説メニューは、じゃんけんで決めます。', 'レア度が高いと、早くても必ずじゃんけん。')],
      [12000, () => this.renderLoseFrame()],
      [15500, () => this.renderSimpleDramaFrame('伝説メニュー、獲得ならず。', 'あなたなら勝てる？', 'lose')],
      [18000, () => this.renderCtaFrame('最後の一口を、勝ち取れ。', '#給食おかわり争奪戦')],
      [20500, () => this.restartWithFade()],
    ]);
  }

  private playCollectionTimeline(): void {
    this.schedule([
      [0, () => this.renderTitleFrame('給食、集めてますか？', '遊ぶたびに今日の給食が変わる。')],
      [2000, () => this.renderMenuListFrame()],
      [5000, () => this.renderRarityFrame()],
      [8000, () => this.renderLegendaryRevealFrame('伝説\n幻のジャンボプリン', 'しかも、早くても必ずじゃんけん。')],
      [12000, () => this.renderCollectionWinFrame()],
      [16000, () => this.renderCollectionBoardFrame()],
      [20500, () => this.renderCtaFrame('あなたの給食コレクションを埋めよう。', '今すぐブラウザで遊ぶ')],
      [23500, () => this.restartWithFade()],
    ]);
  }

  private schedule(items: Array<[number, () => void]>): void {
    items.forEach(([delay, fn]) => {
      this.time.delayedCall(delay, fn);
    });
  }

  private restartWithFade(): void {
    this.cameras.main.fadeOut(320, 16, 24, 32);
    this.time.delayedCall(360, () => {
      this.scene.restart({ variant: this.requestedVariant });
    });
  }

  private resetFrame(background: number = COLORS.cream): void {
    this.children.removeAll(true);
    this.tweens.killAll();
    this.cameras.main.setBackgroundColor(background);
    this.drawClassroom();
  }

  private drawClassroom(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.cream);
    const board = this.add.rectangle(180, 78, 292, 92, COLORS.board);
    board.setStrokeStyle(5, COLORS.boardDark);
    this.add.rectangle(180, 211, 320, 38, COLORS.wood);
    this.add.rectangle(80, 318, 66, 36, COLORS.wood).setStrokeStyle(3, COLORS.black);
    this.add.rectangle(268, 323, 66, 36, COLORS.wood).setStrokeStyle(3, COLORS.black);
    this.add.rectangle(180, 394, 86, 42, COLORS.wood).setStrokeStyle(3, COLORS.black);
    this.drawMilkPack(304, 194);
  }

  private renderTitleFrame(title: string, sub: string): void {
    this.resetFrame(COLORS.navy);
    this.add.rectangle(180, 320, 360, 640, COLORS.navy, 0.34);
    this.addTitle(title, 138, 35);
    this.addText(sub, 180, 196, 16, '#fff3d6');
    this.addText('給食おかわり争奪戦', 180, 290, 30, '#ffffff');
    this.addText('平成学校ゲームズ 第二弾', 180, 330, 15, '#fffd9a');
    this.addFoodRow(180, 438, 1.05);
    this.addCaption('スマホで遊べる16bit風ミニゲーム');
  }

  private renderMenuRevealFrame(): void {
    this.resetFrame();
    this.addTitle('今日の給食', 54, 26, '#ffffff');
    this.addChalkText(['カレー', '揚げパン', 'プリン'], 116);
    this.addText('本日の人気メニュー', 180, 250, 16, '#25313f');
    this.addText('プリン', 180, 290, 42, '#e84b4b');
    drawMenuIcon(this, 180, 382, 'pudding', 1.8);
    this.addCaption('給食の時間が、戦場になる。');
  }

  private renderLegendaryRevealFrame(headline: string, caption: string): void {
    this.resetFrame(COLORS.paper);
    const menu = lunchMenus[LEGENDARY_MENU_ID];
    this.addRarityLabel(menu, 180, 122);
    this.addText(headline, 180, 176, headline.includes('\n') ? 30 : 28, '#172a4a');
    drawMenuIcon(this, 180, 300, LEGENDARY_MENU_ID, 2.35);
    this.addText(menu.name, 180, 382, 24, '#8b5adf');
    this.drawFocusLines(180, 300, COLORS.yellow);
    this.addCaption(caption);
    this.cameras.main.shake(240, 0.006);
  }

  private renderTimingFrame(signal: string, caption: string, running: boolean): void {
    this.resetFrame();
    this.addText('合図を待て…', 180, 116, 24, '#25313f');
    this.addText('まだ押すな…', 180, 154, 20, '#e84b4b');
    this.addText(signal, 180, 210, 34, '#ffffff', '#e84b4b');
    const table = this.add.rectangle(180, 300, 130, 44, COLORS.tray);
    table.setStrokeStyle(4, COLORS.black);
    drawMenuIcon(this, 180, 266, LEGENDARY_MENU_ID, 1.3);
    drawCharacter(this, running ? 94 : 70, 420, 'idle', COLORS.blue);
    drawCharacter(this, 256, 420, 'idle', COLORS.green);
    drawCharacter(this, 180, 410, 'teacher', COLORS.purple);
    this.addButtonLike('並ぶ！', 180, 504);
    this.addCaption(caption);
  }

  private renderJankenFrame(teacherLine: string, caption: string): void {
    this.resetFrame(COLORS.paper);
    this.addSpeech(`先生「${teacherLine}」`, 180, 120, 302);
    drawMenuIcon(this, 180, 206, LEGENDARY_MENU_ID, 1.55);
    drawCharacter(this, 96, 356, 'idle', COLORS.blue);
    drawCharacter(this, 264, 356, 'idle', COLORS.green);
    this.drawJankenHands();
    this.drawFocusLines(180, 324, COLORS.red);
    this.addCaption(caption);
  }

  private renderWinFrame(): void {
    this.resetFrame(0xfff1b8);
    this.addText('じゃんけん勝利！', 180, 86, 32, '#ffffff', '#e84b4b');
    this.addText('伝説メニュー獲得！', 180, 138, 27, '#8b5adf');
    drawCharacter(this, 180, 356, 'win', COLORS.blue);
    drawMenuIcon(this, 180, 236, LEGENDARY_MENU_ID, 1.8);
    drawCharacter(this, 74, 404, 'clap', COLORS.green);
    drawCharacter(this, 286, 404, 'teacher', COLORS.purple);
    this.addText('NEW COLLECTION!', 180, 472, 25, '#ffffff', '#8b5adf');
    this.drawSparkles();
    this.addCaption('勝てば、コレクション登録。');
    this.cameras.main.shake(260, 0.005);
  }

  private renderCollectionWinFrame(): void {
    this.resetFrame(0xfff1b8);
    this.addText('NEW COLLECTION!', 180, 118, 32, '#ffffff', '#8b5adf');
    drawMenuIcon(this, 180, 246, LEGENDARY_MENU_ID, 2);
    this.addText('伝説メニューを登録！', 180, 352, 24, '#172a4a');
    drawCharacter(this, 112, 438, 'win', COLORS.blue);
    drawCharacter(this, 258, 438, 'clap', COLORS.green);
    this.drawSparkles();
    this.addCaption('勝てば、コレクションに登録。');
  }

  private renderLoseFrame(): void {
    this.resetFrame(0xe9defb);
    this.addText('じゃんけん敗北', 180, 94, 34, '#ffffff', '#8b5adf');
    this.addText('幻のまま終わった。', 180, 150, 24, '#172a4a');
    drawCharacter(this, 98, 380, 'down', COLORS.blue);
    drawCharacter(this, 266, 360, 'win', COLORS.green);
    drawCharacter(this, 180, 404, 'teacher', COLORS.purple);
    drawMenuIcon(this, 266, 262, LEGENDARY_MENU_ID, 1.4);
    this.addSpeech('先生「また次ね」', 180, 230, 236);
    this.addCaption('伝説は、友達の手に渡った。');
    this.cameras.main.shake(180, 0.004);
  }

  private renderSimpleDramaFrame(title: string, caption: string, mood: 'lose'): void {
    this.resetFrame(mood === 'lose' ? 0xe9defb : COLORS.paper);
    this.addText(title, 180, 156, 28, '#172a4a');
    drawCharacter(this, 110, 378, 'down', COLORS.blue);
    drawCharacter(this, 260, 362, 'win', COLORS.green);
    drawMenuIcon(this, 260, 260, LEGENDARY_MENU_ID, 1.35);
    this.addCaption(caption);
  }

  private renderMenuListFrame(): void {
    this.resetFrame();
    this.addTitle('登場メニュー', 64, 27, '#ffffff');
    const rows: Array<[LunchMenuId, string]> = [
      ['curry', 'カレー'],
      ['agepan', '揚げパン'],
      ['pudding', 'プリン'],
      ['tanabataJelly', '七夕ゼリー'],
      ['christmasCake', 'クリスマスケーキ'],
      ['jumboPudding', '幻のジャンボプリン'],
    ];
    rows.forEach(([id, name], index) => {
      const y = 150 + index * 54;
      this.add.rectangle(180, y, 292, 42, COLORS.paper).setStrokeStyle(3, COLORS.black);
      drawMenuIcon(this, 68, y - 8, id, 0.72);
      this.addText(name, 196, y, name.length > 10 ? 17 : 20, '#25313f', undefined, 184);
    });
    this.addCaption('給食メニューにはレア度がある。');
  }

  private renderRarityFrame(): void {
    this.resetFrame(COLORS.paper);
    this.addTitle('レア度', 72, 31, '#ffffff');
    const labels: Array<[string, number]> = [
      ['ふつう', COLORS.green],
      ['ちょいレア', COLORS.blue],
      ['レア', COLORS.purple],
      ['激レア', COLORS.red],
      ['伝説', COLORS.yellow],
    ];
    labels.forEach(([label, color], index) => {
      const y = 168 + index * 60;
      this.add.rectangle(180, y, 240, 42, color).setStrokeStyle(4, COLORS.black);
      this.addText(label, 180, y, 23, color === COLORS.yellow ? '#25313f' : '#ffffff');
    });
    this.addCaption('レアなほど、出にくい。');
  }

  private renderCollectionBoardFrame(): void {
    this.resetFrame(COLORS.paper);
    this.addText('給食コレクション', 180, 70, 29, '#ffffff', '#25313f');
    this.addText('17種類中 1種類獲得', 180, 120, 20, '#172a4a');
    this.add.rectangle(180, 260, 304, 300, COLORS.cream).setStrokeStyle(5, COLORS.black);
    this.addText('[伝説] 幻のジャンボプリン', 180, 188, 20, '#8b5adf');
    drawMenuIcon(this, 180, 260, LEGENDARY_MENU_ID, 1.55);
    ['？？？', '？？？', '？？？'].forEach((text, index) => {
      this.addText(text, 180, 340 + index * 38, 21, '#8895a3');
    });
    this.addCaption('何度も遊んで、給食を集めよう。');
  }

  private renderCtaFrame(copy: string, bottom: string): void {
    this.resetFrame(COLORS.navy);
    this.add.rectangle(180, 320, 330, 560, COLORS.paper).setStrokeStyle(6, COLORS.black);
    this.addText('給食おかわり争奪戦', 180, 140, 31, '#ffffff', '#e84b4b');
    this.addFoodRow(180, 250, 1.05);
    this.addText(copy, 180, 352, 23, '#172a4a', undefined, 286);
    this.addText('今すぐブラウザで遊ぶ', 180, 450, 23, '#ffffff', '#37ad6b');
    this.addText(bottom, 180, 520, 18, '#25313f', undefined, 290);
  }

  private renderThumbnail(): void {
    this.resetFrame(COLORS.navy);
    this.add.rectangle(180, 320, 340, 602, COLORS.paper).setStrokeStyle(7, COLORS.black);
    this.addText('給食おかわり争奪戦', 180, 82, 33, '#ffffff', '#e84b4b');
    this.addText('最後のプリン、取れるか。', 180, 132, 22, '#172a4a');
    this.add.rectangle(180, 186, 108, 34, COLORS.yellow).setStrokeStyle(4, COLORS.black);
    this.addText('伝説', 180, 186, 23, '#25313f');
    drawMenuIcon(this, 180, 278, LEGENDARY_MENU_ID, 2.25);
    this.addText('幻のジャンボプリン', 180, 370, 24, '#8b5adf', undefined, 304);
    this.drawJankenHands(442);
    this.addText('NEW COLLECTION!', 180, 548, 30, '#ffffff', '#8b5adf');
    this.drawSparkles();
  }

  private addFoodRow(x: number, y: number, scale: number): void {
    drawMenuIcon(this, x - 92, y, 'curry', scale);
    drawMenuIcon(this, x, y, 'agepan', scale);
    drawMenuIcon(this, x + 92, y, 'pudding', scale);
  }

  private drawJankenHands(y = 486): void {
    const hands = ['グー', 'チョキ', 'パー'];
    hands.forEach((hand, index) => {
      const x = 80 + index * 100;
      this.add.rectangle(x, y, 86, 54, COLORS.white).setStrokeStyle(4, COLORS.black);
      this.addText(hand, x, y, 20, '#172a4a');
    });
  }

  private drawMilkPack(x: number, y: number): void {
    const pack = this.add.rectangle(x, y, 28, 42, COLORS.white);
    pack.setStrokeStyle(3, COLORS.black);
    this.add.rectangle(x, y, 18, 10, COLORS.blue);
  }

  private drawSparkles(): void {
    for (let i = 0; i < 16; i += 1) {
      const x = Phaser.Math.Between(34, 326);
      const y = Phaser.Math.Between(118, 480);
      const sparkle = this.add.star(x, y, 4, 4, 12, Phaser.Math.RND.pick([COLORS.yellow, COLORS.white, COLORS.red]));
      this.tweens.add({
        targets: sparkle,
        scale: { from: 0.75, to: 1.2 },
        alpha: { from: 0.45, to: 1 },
        duration: 520,
        delay: i * 40,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private drawFocusLines(cx: number, cy: number, color: number): void {
    for (let i = 0; i < 18; i += 1) {
      const angle = (Math.PI * 2 * i) / 18;
      const x1 = cx + Math.cos(angle) * 76;
      const y1 = cy + Math.sin(angle) * 76;
      const x2 = cx + Math.cos(angle) * 168;
      const y2 = cy + Math.sin(angle) * 168;
      this.add.line(0, 0, x1, y1, x2, y2, color).setLineWidth(4).setAlpha(0.5);
    }
  }

  private addTitle(text: string, y: number, size: number, color = '#fff3d6'): void {
    this.addText(text, 180, y, size, color, undefined, 320);
  }

  private addCaption(text: string): void {
    const lineCount = text.split('\n').length;
    const height = lineCount > 1 ? 78 : 58;
    this.add.rectangle(180, 580, 328, height, COLORS.black, 0.82).setStrokeStyle(4, COLORS.white);
    this.addText(text, 180, 580, lineCount > 1 ? 19 : 21, '#ffffff', undefined, 300);
  }

  private addSpeech(text: string, x: number, y: number, width: number): void {
    this.add.rectangle(x, y, width, 48, COLORS.white).setStrokeStyle(4, COLORS.black);
    this.addText(text, x, y, text.length > 20 ? 14 : 16, '#172a4a', undefined, width - 20);
  }

  private addButtonLike(text: string, x: number, y: number): void {
    this.add.rectangle(x, y, 250, 64, COLORS.red).setStrokeStyle(5, COLORS.black);
    this.addText(text, x, y, 28, '#ffffff');
  }

  private addChalkText(lines: string[], startY: number): void {
    lines.forEach((line, index) => {
      this.addText(line, 180, startY + index * 34, 21, '#f5ffe9');
    });
  }

  private addRarityLabel(menu: LunchMenu, x: number, y: number): void {
    this.add.rectangle(x, y, 126, 38, COLORS.yellow).setStrokeStyle(4, COLORS.black);
    this.addText(rarityLabels[menu.rarity], x, y, 24, '#25313f');
  }

  private addText(
    text: string,
    x: number,
    y: number,
    size: number,
    color: string,
    backgroundColor?: string,
    wrapWidth = 320,
  ): Phaser.GameObjects.Text {
    return this.add.text(x, y, text, {
      fontFamily: FONT_FAMILY,
      fontSize: `${size}px`,
      color,
      backgroundColor,
      padding: backgroundColor ? { x: 8, y: 5 } : undefined,
      align: 'center',
      fontStyle: 'bold',
      lineSpacing: 6,
      wordWrap: { width: wrapWidth },
    }).setOrigin(0.5);
  }
}

function isRecordingVariant(value: string | undefined): value is RecordingVariant {
  return RECORDING_VARIANTS.includes(value as RecordingVariant);
}

function getRecordingVariantFromUrl(): RecordingVariant | undefined {
  const value = new URLSearchParams(window.location.search).get('recording') ?? undefined;
  return isRecordingVariant(value) ? value : undefined;
}
