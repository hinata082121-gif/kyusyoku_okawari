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
    this.time.delayedCall(250, () => {
      const recordingVariant = getRecordingVariant();
      this.scene.start(recordingVariant ? SceneKeys.Recording : SceneKeys.Title, recordingVariant ? { variant: recordingVariant } : undefined);
    });
  }
}

function getRecordingVariant(): string | undefined {
  const value = new URLSearchParams(window.location.search).get('recording');
  if (value === 'win' || value === 'lose' || value === 'random' || value === 'collection' || value === 'thumbnail') {
    return value;
  }
  return undefined;
}
