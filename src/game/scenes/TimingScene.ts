import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { SpeechBubble } from '../ui/SpeechBubble';
import { COLORS, FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../constants';
import type { GameState, LunchMenu } from '../types';
import { getReactionTimeMs, getSignalWaitMs } from '../systems/timingSystem';
import { getRankFromReaction } from '../systems/rankSystem';
import { drawCharacter, drawMenuIcon } from '../ui/ResultCard';
import { getMenuFromState, normalizePlayableState } from '../systems/gameStateSystem';
import { trackTimingTap } from '../../lib/analytics';

export class TimingScene extends Phaser.Scene {
  private state?: GameState;
  private signalStarted = false;
  private signalAt = 0;
  private tapped = false;
  private cueText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private teacherBubble?: SpeechBubble;
  private lineButton?: Button;

  constructor() {
    super(SceneKeys.Timing);
  }

  init(data: Partial<GameState> | undefined): void {
    this.state = normalizePlayableState(data);
    this.signalStarted = false;
    this.signalAt = 0;
    this.tapped = false;
  }

  create(): void {
    if (!this.state) {
      this.scene.start(SceneKeys.MenuReveal);
      return;
    }

    const menu = getMenuFromState(this.state);
    this.cameras.main.setBackgroundColor(0xf0c27a);
    this.drawHud(menu);
    this.drawRoom(menu);

    this.cueText = this.add.text(GAME_WIDTH / 2, 272, '合図を待て…', {
      fontFamily: FONT_FAMILY,
      fontSize: '28px',
      color: '#fff3d6',
      stroke: '#101820',
      strokeThickness: 6,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.statusText = this.add.text(GAME_WIDTH / 2, 520, '先生の合図まで待とう', {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#172a4a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.lineButton = new Button(this, GAME_WIDTH / 2, 584, 304, 72, '並ぶ！', () => this.handleTap(), {
      fillColor: COLORS.red,
      fontSize: 28,
    });

    this.teacherBubble = new SpeechBubble(this, GAME_WIDTH / 2, 174, 244, '静かに並びなさい');
    const waitMs = getSignalWaitMs();
    this.time.delayedCall(Math.max(300, waitMs - 800), () => this.showAlmostSignal());
    this.time.delayedCall(waitMs, () => this.startSignal());
  }

  private handleTap(): void {
    if (!this.state || this.tapped) return;
    const state = this.state;
    this.tapped = true;
    const menu = getMenuFromState(state);
    this.lineButton?.setDisabled(true);

    if (!this.signalStarted) {
      trackTimingTap(menu.name, null, null, true);
      this.scene.start(SceneKeys.Result, {
        ...state,
        remainingServings: menu.remainingServings,
        resultType: 'flying',
      } satisfies GameState);
      return;
    }

    const tappedAt = this.time.now;
    const reactionTimeMs = getReactionTimeMs(this.signalAt, tappedAt);
    const rank = getRankFromReaction(reactionTimeMs);
    trackTimingTap(menu.name, reactionTimeMs, rank, false);
    this.cueText?.setText('列へダッシュ！');
    this.statusText?.setText(`${reactionTimeMs}msで反応！`);
    this.cameras.main.shake(120, 0.004);
    this.time.delayedCall(320, () => this.scene.start(SceneKeys.Queue, {
      ...state,
      reactionTimeMs,
      rank,
      remainingServings: menu.remainingServings,
    } satisfies GameState));
  }

  private showAlmostSignal(): void {
    if (this.signalStarted || this.tapped) return;
    this.cueText?.setText('まだ押すな…！');
    this.statusText?.setText('指はボタンの上、心は静かに');
    this.teacherBubble?.setText('まだですよ');
  }

  private startSignal(): void {
    if (this.tapped) return;
    this.signalStarted = true;
    this.signalAt = this.time.now;
    this.cueText?.setText('おかわり開始！');
    this.cueText?.setColor('#fffd9a');
    this.statusText?.setText('今だ！');
    this.teacherBubble?.setText('合図しました！');
    this.cameras.main.flash(120, 255, 243, 214);
  }

  private drawHud(menu: LunchMenu): void {
    this.add.rectangle(GAME_WIDTH / 2, 54, 330, 82, COLORS.navy).setStrokeStyle(4, COLORS.black);
    this.add.text(28, 28, `人気メニュー：${menu.name}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '17px',
      color: '#fff8e8',
      fontStyle: 'bold',
    });
    this.add.text(28, 58, `残りおかわり：${menu.remainingServings}個`, {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#fffd9a',
      fontStyle: 'bold',
    });
    this.add.text(182, 58, '人気度', {
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      color: '#fff8e8',
      fontStyle: 'bold',
    });
    this.add.rectangle(272, 66, 104, 12, COLORS.black);
    this.add.rectangle(272 - 52 + (104 * menu.popularity) / 200, 66, (104 * menu.popularity) / 100, 8, menu.accentColor);
  }

  private drawRoom(menu: LunchMenu): void {
    this.add.rectangle(GAME_WIDTH / 2, 132, 304, 58, COLORS.board).setStrokeStyle(4, COLORS.boardDark);
    this.add.text(GAME_WIDTH / 2, 132, 'おかわりは先生の合図で', {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#f5ffe9',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.rectangle(GAME_WIDTH / 2, 390, 292, 78, COLORS.wood).setStrokeStyle(4, COLORS.black);
    this.add.text(GAME_WIDTH / 2, 354, '給食台', {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#fff8e8',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    drawMenuIcon(this, GAME_WIDTH / 2, 402, menu.id, 1.2);
    drawCharacter(this, 72, 470, 'idle', COLORS.blue);
    drawCharacter(this, 132, 470, 'idle', COLORS.green);
    drawCharacter(this, 208, 356, 'idle', COLORS.white);
    drawCharacter(this, 284, 324, 'teacher', COLORS.purple);
    this.add.text(72, 522, 'あなた', smallLabelStyle()).setOrigin(0.5);
    this.add.text(132, 522, 'ライバル', smallLabelStyle()).setOrigin(0.5);
    this.add.text(210, 408, '配膳係', smallLabelStyle()).setOrigin(0.5);
    this.add.text(284, 376, '先生', smallLabelStyle()).setOrigin(0.5);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 102, GAME_WIDTH, 6, COLORS.navy, 0.35);
  }
}

function smallLabelStyle(): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    color: '#172a4a',
    backgroundColor: '#fff8e8',
    padding: { x: 5, y: 2 },
    fontStyle: 'bold',
  };
}
