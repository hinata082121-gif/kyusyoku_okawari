import Phaser from 'phaser';
import { COLORS, FONT_FAMILY } from '../constants';

export class SpeechBubble extends Phaser.GameObjects.Container {
  private readonly text: Phaser.GameObjects.Text;
  private readonly box: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, text: string) {
    super(scene, x, y);
    this.box = scene.add.rectangle(0, 0, width, 54, COLORS.white);
    this.box.setStrokeStyle(3, COLORS.black);
    const tail = scene.add.triangle(-width / 2 + 28, 31, 0, 0, 14, 0, 3, 14, COLORS.white);
    tail.setStrokeStyle(2, COLORS.black);
    this.text = scene.add
      .text(0, 0, text, {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: '#172a4a',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: width - 22 },
      })
      .setOrigin(0.5);
    this.add([this.box, tail, this.text]);
    scene.add.existing(this);
  }

  setText(text: string): void {
    this.text.setText(text);
  }
}
