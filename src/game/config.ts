import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SceneKeys } from './constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { MenuRevealScene } from './scenes/MenuRevealScene';
import { TimingScene } from './scenes/TimingScene';
import { QueueScene } from './scenes/QueueScene';
import { JankenScene } from './scenes/JankenScene';
import { ResultScene } from './scenes/ResultScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#12223a',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [
    BootScene,
    TitleScene,
    MenuRevealScene,
    TimingScene,
    QueueScene,
    JankenScene,
    ResultScene,
  ],
  title: SceneKeys.Title,
};
