import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_WIDTH, SceneKeys } from '../constants';
import type { GameState, JankenHand } from '../types';
import { Button } from '../ui/Button';
import { SpeechBubble } from '../ui/SpeechBubble';
import { drawCharacter, drawMenuIcon } from '../ui/ResultCard';
import { getHandLabel, getRandomCpuHand, judgeJanken } from '../systems/jankenSystem';
import { getMenuFromState, normalizePlayableState } from '../systems/gameStateSystem';
import { trackJankenResult, trackJankenStart } from '../../lib/analytics';

export class JankenScene extends Phaser.Scene {
  private state?: GameState;
  private statusText?: Phaser.GameObjects.Text;
  private handText?: Phaser.GameObjects.Text;
  private buttons: Button[] = [];

  constructor() {
    super(SceneKeys.Janken);
  }

  init(data: Partial<GameState> | undefined): void {
    this.state = normalizePlayableState(data);
    this.buttons = [];
  }

  create(): void {
    if (!this.state) {
      this.scene.start(SceneKeys.MenuReveal);
      return;
    }

    const menu = getMenuFromState(this.state);
    trackJankenStart(menu);
    this.cameras.main.setBackgroundColor(0xf0c27a);
    this.add.rectangle(GAME_WIDTH / 2, 54, 324, 78, COLORS.navy).setStrokeStyle(4, COLORS.black);
    this.add.text(GAME_WIDTH / 2, 44, '残り1個じゃんけん', {
      fontFamily: FONT_FAMILY,
      fontSize: '26px',
      color: '#fff3d6',
      stroke: '#101820',
      strokeThickness: 5,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 76, `勝てば ${menu.name} 獲得`, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#fffd9a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    new SpeechBubble(this, GAME_WIDTH / 2, 136, 282, '残り1個だから、じゃんけんね');
    drawMenuIcon(this, GAME_WIDTH / 2, 222, menu.id, 1.35);
    drawCharacter(this, 92, 346, 'idle', COLORS.blue);
    drawCharacter(this, 268, 346, 'idle', COLORS.green);
    this.add.text(92, 406, 'あなた', labelStyle('#fffd9a')).setOrigin(0.5);
    this.add.text(268, 406, 'ライバル', labelStyle('#fff8e8')).setOrigin(0.5);

    this.handText = this.add.text(GAME_WIDTH / 2, 436, '手を選べ！', {
      fontFamily: FONT_FAMILY,
      fontSize: '22px',
      color: '#172a4a',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);
    this.statusText = this.add.text(GAME_WIDTH / 2, 468, '残り1個。ここで決まる。', {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      color: '#172a4a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.buttons = [
      new Button(this, 68, 558, 96, 64, 'グー', () => this.play('rock'), { fillColor: COLORS.red, fontSize: 19 }),
      new Button(this, 180, 558, 96, 64, 'チョキ', () => this.play('scissors'), { fillColor: COLORS.orange, fontSize: 18 }),
      new Button(this, 292, 558, 96, 64, 'パー', () => this.play('paper'), { fillColor: COLORS.blue, fontSize: 19 }),
    ];
  }

  private play(playerHand: JankenHand): void {
    if (!this.state) return;
    const state = this.state;
    this.buttons.forEach((button) => button.setDisabled(true));
    const cpuHand = getRandomCpuHand();
    const result = judgeJanken(playerHand, cpuHand);
    this.handText?.setText(`あなた：${getHandLabel(playerHand)}　相手：${getHandLabel(cpuHand)}`);

    if (result === 'draw') {
      this.statusText?.setColor('#e84b4b');
      this.statusText?.setText('あいこ！もう一回！');
      this.cameras.main.shake(100, 0.003);
      this.time.delayedCall(850, () => {
        this.statusText?.setColor('#172a4a');
        this.statusText?.setText('もう一回！');
        this.handText?.setText('もう一回！');
        this.buttons.forEach((button) => button.setDisabled(false));
      });
      return;
    }

    const resultType = result === 'win' ? 'lastOneSuccess' : 'jankenLose';
    const menu = getMenuFromState(state);
    trackJankenResult(result, menu);
    this.statusText?.setColor(result === 'win' ? '#1f7a4d' : '#e84b4b');
    this.statusText?.setText(result === 'win' ? '勝った！' : '負けた…');
    this.cameras.main.shake(160, result === 'win' ? 0.006 : 0.004);
    this.time.delayedCall(780, () => {
      this.scene.start(SceneKeys.Result, {
        ...state,
        resultType,
        jankenPlayerHand: playerHand,
        jankenCpuHand: cpuHand,
      } satisfies GameState);
    });
  }
}

function labelStyle(backgroundColor: string): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_FAMILY,
    fontSize: '13px',
    color: '#172a4a',
    backgroundColor,
    padding: { x: 6, y: 2 },
    fontStyle: 'bold',
  };
}
