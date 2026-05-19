import Phaser from 'phaser';
import { COLORS } from '../constants';

export class PixelPanel extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: number = COLORS.paper,
    strokeColor: number = COLORS.black,
  ) {
    super(scene, x, y);
    const shadow = scene.add.rectangle(4, 5, width, height, 0x000000, 0.18);
    const panel = scene.add.rectangle(0, 0, width, height, fillColor);
    panel.setStrokeStyle(4, strokeColor);
    const highlight = scene.add.rectangle(0, -height / 2 + 7, width - 10, 4, 0xffffff, 0.35);
    this.add([shadow, panel, highlight]);
    scene.add.existing(this);
  }
}
