import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { ResultCard } from '../ui/ResultCard';
import { COLORS, FONT_FAMILY, GAME_WIDTH, SceneKeys, UI } from '../constants';
import type { GameState, ResultType } from '../types';
import { buildShareCopy, pickMainCopy } from '../systems/shareTextSystem';
import { getMenuFromState, normalizeResultState } from '../systems/gameStateSystem';
import { trackResultView, trackRetryClick, trackShareCopyClick } from '../../lib/analytics';

export class ResultScene extends Phaser.Scene {
  private state?: GameState;

  constructor() {
    super(SceneKeys.Result);
  }

  init(data: Partial<GameState> | undefined): void {
    this.state = normalizeResultState(data);
  }

  create(): void {
    if (!this.state) {
      this.scene.start(SceneKeys.MenuReveal);
      return;
    }

    const menu = getMenuFromState(this.state);
    const resultType: ResultType = this.state.resultType ?? 'soldOut';
    const mainCopy = pickMainCopy(resultType, menu);
    const shareCopy = buildShareCopy(resultType, menu, mainCopy);
    const stateWithShare: GameState = { ...this.state, resultType, shareCopy };
    trackResultView(resultType, menu.name, this.state.reactionTimeMs, this.state.rank);

    this.cameras.main.setBackgroundColor(getBackgroundColor(resultType));
    drawPixelConfetti(this, resultType);
    if (resultType === 'success' || resultType === 'lastOneSuccess') {
      this.cameras.main.shake(110, 0.003);
    } else {
      this.cameras.main.shake(130, 0.004);
      this.add.rectangle(GAME_WIDTH / 2, 320, GAME_WIDTH, 640, 0x000000, 0.12);
    }

    this.add.text(GAME_WIDTH / 2, 30, '給食おかわり争奪戦', {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#fff3d6',
      stroke: '#101820',
      strokeThickness: 4,
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    new ResultCard(this, stateWithShare, menu, mainCopy);

    const feedbackText = this.add.text(GAME_WIDTH / 2, 514, '', {
      fontFamily: FONT_FAMILY,
      fontSize: '13px',
      color: '#fff8e8',
      stroke: '#101820',
      strokeThickness: 3,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    new Button(this, GAME_WIDTH / 2, UI.bottomPrimaryY, 284, UI.primaryButtonHeight, 'もう一回', () => {
      trackRetryClick(resultType, menu.name);
      this.scene.start(SceneKeys.MenuReveal);
    }, { fillColor: COLORS.red, fontSize: 22 });

    new Button(this, 96, UI.bottomSecondaryY, 154, UI.secondaryButtonHeight, 'タイトルへ', () => {
      this.scene.start(SceneKeys.Title);
    }, { fillColor: COLORS.navy, fontSize: 15 });

    new Button(this, 256, UI.bottomSecondaryY, 122, UI.secondaryButtonHeight, 'コピー', () => {
      trackShareCopyClick(resultType, menu.name);
      this.copyShareText(shareCopy, feedbackText);
    }, { fillColor: COLORS.green, fontSize: 15 });
  }

  private copyShareText(shareCopy: string, feedbackText: Phaser.GameObjects.Text): void {
    const done = () => feedbackText.setText('コピーしました！');
    const fallback = () => {
      if (copyTextFallback(shareCopy)) {
        done();
        return;
      }
      feedbackText.setText('コピー非対応の環境です');
    };

    if (!navigator.clipboard) {
      fallback();
      return;
    }

    void navigator.clipboard.writeText(shareCopy).then(done, fallback);
  }
}

function copyTextFallback(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

function getBackgroundColor(resultType: ResultType): number {
  if (resultType === 'success' || resultType === 'lastOneSuccess') return 0xf38a2e;
  if (resultType === 'flying') return 0xb8333a;
  if (resultType === 'jankenLose') return 0x6d5ba8;
  return 0x4f8dd8;
}

function drawPixelConfetti(scene: Phaser.Scene, resultType: ResultType): void {
  const bright = resultType === 'success' || resultType === 'lastOneSuccess';
  const colors = bright
    ? [COLORS.yellow, COLORS.cream, COLORS.red, COLORS.green]
    : [COLORS.paper, COLORS.tray, COLORS.navy, COLORS.cream];
  for (let i = 0; i < 34; i += 1) {
    const x = Phaser.Math.Between(12, 348);
    const y = Phaser.Math.Between(92, 512);
    const rect = scene.add.rectangle(x, y, Phaser.Math.Between(4, 10), Phaser.Math.Between(4, 10), Phaser.Math.RND.pick(colors), 0.75);
    rect.setAngle(Phaser.Math.Between(0, 45));
  }
}
