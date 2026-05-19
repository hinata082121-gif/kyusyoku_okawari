import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_WIDTH, SceneKeys } from '../constants';
import type { GameState } from '../types';
import { getRankLabel, getRankReactionText } from '../systems/rankSystem';
import { decideQueueOutcome } from '../systems/resultSystem';
import { SpeechBubble } from '../ui/SpeechBubble';
import { drawCharacter, drawMenuIcon } from '../ui/ResultCard';
import { getMenuFromState, normalizePlayableState } from '../systems/gameStateSystem';

export class QueueScene extends Phaser.Scene {
  private state?: GameState;

  constructor() {
    super(SceneKeys.Queue);
  }

  init(data: Partial<GameState> | undefined): void {
    this.state = normalizePlayableState(data);
  }

  create(): void {
    if (!this.state) {
      this.scene.start(SceneKeys.MenuReveal);
      return;
    }

    const menu = getMenuFromState(this.state);
    const state: GameState = {
      ...this.state,
      rank: this.state.rank ?? 5,
      remainingServings: this.state.remainingServings ?? menu.remainingServings,
    };
    this.state = state;
    this.cameras.main.setBackgroundColor(0xf0c27a);
    this.add.rectangle(GAME_WIDTH / 2, 70, 318, 92, COLORS.navy).setStrokeStyle(4, COLORS.black);
    this.add.text(GAME_WIDTH / 2, 46, `あなたの順位：${getRankLabel(this.state.rank)}！`, {
      fontFamily: FONT_FAMILY,
      fontSize: '27px',
      color: '#fff3d6',
      stroke: '#101820',
      strokeThickness: 5,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 88, `残りおかわり：${this.state.remainingServings}個`, {
      fontFamily: FONT_FAMILY,
      fontSize: '19px',
      color: '#fffd9a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.rectangle(GAME_WIDTH / 2, 292, 300, 94, COLORS.wood).setStrokeStyle(4, COLORS.black);
    drawMenuIcon(this, GAME_WIDTH / 2, 296, menu.id, 1.25);
    this.drawQueueLine();

    const decision = decideQueueOutcome(this.state, menu);
    const bubbleText = decision.next === 'janken'
      ? '残り1個だから、じゃんけんね'
      : decision.resultType === 'success'
        ? '間に合ったね'
        : 'もうありません';
    new SpeechBubble(this, GAME_WIDTH / 2, 440, 270, bubbleText);

    const queueCopy = decision.next === 'janken'
      ? '残り1個！勝負はじゃんけんへ！'
      : decision.resultType === 'soldOut'
        ? '目の前でなくなった…'
        : getRankReactionText(this.state.rank);

    this.add.text(GAME_WIDTH / 2, 510, queueCopy, {
      fontFamily: FONT_FAMILY,
      fontSize: '19px',
      color: '#172a4a',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 310 },
    }).setOrigin(0.5);
    this.cameras.main.shake(120, decision.next === 'janken' ? 0.005 : 0.002);

    const nextState = this.state;
    this.time.delayedCall(1400, () => {
      if (decision.next === 'janken') {
        this.scene.start(SceneKeys.Janken, nextState);
        return;
      }
      this.scene.start(SceneKeys.Result, { ...nextState, resultType: decision.resultType } satisfies GameState);
    });
  }

  private drawQueueLine(): void {
    if (!this.state) return;
    const rank = this.state.rank ?? 5;
    const positions = [
      { x: 90, y: 364 },
      { x: 132, y: 350 },
      { x: 174, y: 364 },
      { x: 216, y: 350 },
      { x: 258, y: 364 },
    ];
    positions.forEach((pos, index) => {
      const isPlayer = index + 1 === rank || (rank >= 5 && index === 4);
      drawCharacter(this, pos.x, pos.y, isPlayer ? 'win' : 'idle', isPlayer ? COLORS.blue : COLORS.green);
      this.add.text(pos.x, pos.y + 54, isPlayer ? 'あなた' : `${index + 1}番`, {
        fontFamily: FONT_FAMILY,
        fontSize: '11px',
        color: '#172a4a',
        backgroundColor: isPlayer ? '#fffd9a' : '#fff8e8',
        padding: { x: 4, y: 2 },
        fontStyle: 'bold',
      }).setOrigin(0.5);
    });
  }
}
