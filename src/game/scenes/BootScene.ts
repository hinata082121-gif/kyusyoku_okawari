import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.navy);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, '給食準備中...', {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        color: '#fff3d6',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.time.delayedCall(250, () => this.scene.start(SceneKeys.Title));
  }
}
