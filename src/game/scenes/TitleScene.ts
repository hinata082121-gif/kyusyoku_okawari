import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { COLORS, FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../constants';
import { drawMenuIcon } from '../ui/ResultCard';

export class TitleScene extends Phaser.Scene {
  private helpLayer?: Phaser.GameObjects.Container;

  constructor() {
    super(SceneKeys.Title);
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x82c6e6);
    drawClassroom(this);

    this.add
      .text(GAME_WIDTH / 2, 54, '平成学校ゲームズ 第二弾', {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        color: '#fff8e8',
        backgroundColor: '#25313f',
        padding: { x: 10, y: 4 },
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 112, '給食おかわり\n争奪戦', {
        fontFamily: FONT_FAMILY,
        fontSize: '42px',
        color: '#fff3d6',
        stroke: '#101820',
        strokeThickness: 8,
        align: 'center',
        lineSpacing: -6,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 190, '最後のプリン、取れるか。', {
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        color: '#172a4a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add.rectangle(GAME_WIDTH / 2, 404, 260, 92, COLORS.wood).setStrokeStyle(4, COLORS.black);
    this.add.text(GAME_WIDTH / 2, 364, '本日の給食台', {
      fontFamily: FONT_FAMILY,
      fontSize: '14px',
      color: '#fff8e8',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    drawMenuIcon(this, 116, 412, 'curry', 1);
    drawMenuIcon(this, 180, 412, 'agepan', 1);
    drawMenuIcon(this, 244, 412, 'pudding', 1);

    new Button(this, GAME_WIDTH / 2, 500, 176, 48, '遊び方', () => {
      this.showHowToPlay();
    }, { fillColor: COLORS.navy, fontSize: 17 });

    new Button(this, GAME_WIDTH / 2, 570, 286, 62, 'スタート', () => {
      this.scene.start(SceneKeys.MenuReveal);
    }, { fillColor: COLORS.red, fontSize: 26 });
  }

  private showHowToPlay(): void {
    if (this.helpLayer) return;

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101820, 0.62);
    overlay.setInteractive();
    const panel = this.add.rectangle(GAME_WIDTH / 2, 320, 314, 360, COLORS.paper);
    panel.setStrokeStyle(5, COLORS.black);
    const title = this.add.text(GAME_WIDTH / 2, 178, '遊び方', {
      fontFamily: FONT_FAMILY,
      fontSize: '28px',
      color: '#172a4a',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const description = this.add.text(GAME_WIDTH / 2, 286, [
      '1. 合図を待つ',
      '2. 「並ぶ！」を押す',
      '3. 残り1個ならじゃんけん',
      '4. 人気メニューを勝ち取ろう',
      '',
      '1プレイ短時間でリトライできます。',
    ], {
      fontFamily: FONT_FAMILY,
      fontSize: '18px',
      color: '#25313f',
      fontStyle: 'bold',
      lineSpacing: 8,
      align: 'left',
      wordWrap: { width: 260 },
    }).setOrigin(0.5);
    const closeButton = new Button(this, GAME_WIDTH / 2, 452, 220, 54, '閉じる', () => {
      this.helpLayer?.destroy(true);
      this.helpLayer = undefined;
    }, { fillColor: COLORS.green, fontSize: 20 });

    this.helpLayer = this.add.container(0, 0, [overlay, panel, title, description, closeButton]);
    this.helpLayer.setDepth(20);
  }
}

function drawClassroom(scene: Phaser.Scene): void {
  scene.add.rectangle(GAME_WIDTH / 2, 148, 320, 122, COLORS.board).setStrokeStyle(5, COLORS.boardDark);
  scene.add.text(GAME_WIDTH / 2, 150, 'おかわりは合図のあと', {
    fontFamily: FONT_FAMILY,
    fontSize: '17px',
    color: '#f5ffe9',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  scene.add.rectangle(GAME_WIDTH / 2, 520, GAME_WIDTH, 240, 0xf0c27a);
  for (let y = 242; y < GAME_HEIGHT; y += 38) {
    scene.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH, 3, 0xd59b5f, 0.55);
  }
  for (let i = 0; i < 5; i += 1) {
    const x = 44 + i * 68;
    scene.add.rectangle(x, 274, 44, 30, COLORS.wood).setStrokeStyle(2, COLORS.woodDark);
    scene.add.rectangle(x, 306, 38, 24, 0x5e7bb8).setStrokeStyle(2, COLORS.black);
  }
  scene.add.rectangle(26, 224, 36, 60, 0xdce8f4).setStrokeStyle(3, COLORS.black);
  scene.add.rectangle(26, 190, 30, 14, COLORS.white).setStrokeStyle(2, COLORS.black);
}
