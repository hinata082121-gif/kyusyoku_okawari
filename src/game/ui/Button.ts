import Phaser from 'phaser';
import { COLORS, FONT_FAMILY } from '../constants';

export interface ButtonOptions {
  fillColor?: number;
  strokeColor?: number;
  textColor?: string;
  fontSize?: number;
  disabled?: boolean;
}

export class Button extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly labelText: Phaser.GameObjects.Text;
  private readonly onClick: () => void;
  private disabled: boolean;
  private readonly fillColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onClick: () => void,
    options: ButtonOptions = {},
  ) {
    super(scene, x, y);
    this.onClick = onClick;
    this.disabled = options.disabled ?? false;
    this.fillColor = options.fillColor ?? COLORS.orange;

    this.background = scene.add.rectangle(0, 0, width, height, this.fillColor);
    this.background.setStrokeStyle(4, options.strokeColor ?? COLORS.black);
    this.labelText = scene.add
      .text(0, 0, label, {
        fontFamily: FONT_FAMILY,
        fontSize: `${options.fontSize ?? 22}px`,
        color: options.textColor ?? '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.background.setInteractive({ useHandCursor: true });
    this.add([this.background, this.labelText]);
    this.setSize(width, height);

    this.background.on('pointerdown', () => {
      if (this.disabled) return;
      this.scene.tweens.add({
        targets: this,
        scaleX: 0.96,
        scaleY: 0.96,
        duration: 60,
        yoyo: true,
      });
      this.onClick();
    });
    this.background.on('pointerover', () => {
      if (!this.disabled) this.background.setFillStyle(Phaser.Display.Color.ValueToColor(this.fillColor).brighten(12).color);
    });
    this.background.on('pointerout', () => {
      this.background.setFillStyle(this.disabled ? COLORS.trayDark : this.fillColor);
    });

    scene.add.existing(this);
    this.setDisabled(this.disabled);
  }

  setLabel(label: string): void {
    this.labelText.setText(label);
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    this.setAlpha(disabled ? 0.65 : 1);
    this.background.setFillStyle(disabled ? COLORS.trayDark : this.fillColor);
  }
}
