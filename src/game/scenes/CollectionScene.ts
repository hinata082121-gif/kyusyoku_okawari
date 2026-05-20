import Phaser from 'phaser';
import { COLORS, FONT_FAMILY, GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../constants';
import { lunchMenuList, rarityColors, rarityLabels } from '../data/menus';
import { getCollection, getCollectionStats } from '../systems/collectionSystem';
import { Button } from '../ui/Button';
import { drawMenuIcon } from '../ui/ResultCard';
import { trackCollectionView } from '../../lib/analytics';

export class CollectionScene extends Phaser.Scene {
  private listContainer?: Phaser.GameObjects.Container;
  private scrollY = 0;
  private maxScrollY = 0;
  private dragging = false;
  private lastPointerY = 0;

  constructor() {
    super(SceneKeys.Collection);
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x12223a);
    const collection = getCollection();
    const stats = getCollectionStats();
    trackCollectionView(stats.acquired);

    this.add.rectangle(GAME_WIDTH / 2, 54, 330, 84, COLORS.navy).setStrokeStyle(4, COLORS.black);
    this.add.text(GAME_WIDTH / 2, 36, '給食コレクション', {
      fontFamily: FONT_FAMILY,
      fontSize: '27px',
      color: '#fff3d6',
      stroke: '#101820',
      strokeThickness: 5,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 72, `獲得 ${stats.acquired}/${stats.total}　発見 ${stats.discovered}/${stats.total}`, {
      fontFamily: FONT_FAMILY,
      fontSize: '15px',
      color: '#fffd9a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const raritySummary = Object.entries(stats.byRarity)
      .map(([rarity, value]) => `${rarityLabels[rarity as keyof typeof rarityLabels]} ${value.acquired}/${value.total}`)
      .join(' / ');
    this.add.text(GAME_WIDTH / 2, 112, raritySummary, {
      fontFamily: FONT_FAMILY,
      fontSize: '11px',
      color: '#fff8e8',
      align: 'center',
      wordWrap: { width: 330 },
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.rectangle(GAME_WIDTH / 2, 356, 330, 444, COLORS.paper).setStrokeStyle(4, COLORS.black);
    this.listContainer = this.add.container(0, 144);
    const maskGraphics = this.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(18, 138, 324, 448);
    this.listContainer.setMask(maskGraphics.createGeometryMask());

    let y = 0;
    for (const menu of lunchMenuList) {
      const entry = collection[menu.id];
      const label = rarityLabels[menu.rarity];
      const isHidden = !entry.discovered;
      const isPending = entry.discovered && !entry.acquired;
      const rowColor = entry.acquired ? 0xffffff : isPending ? 0xf1ead7 : 0xd8dde5;
      const row = this.add.rectangle(GAME_WIDTH / 2, y + 27, 306, 52, rowColor);
      row.setStrokeStyle(3, entry.acquired ? rarityColors[menu.rarity] : COLORS.trayDark);
      row.setAlpha(isHidden ? 0.7 : 1);

      const rarityTag = this.add.text(34, y + 15, `[${label}]`, {
        fontFamily: FONT_FAMILY,
        fontSize: '11px',
        color: entry.acquired ? '#172a4a' : '#8895a3',
        fontStyle: 'bold',
      });
      const name = this.add.text(102, y + 12, isHidden ? '？？？' : menu.name, {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: entry.acquired ? '#172a4a' : '#8895a3',
        fontStyle: 'bold',
      });
      const detailText = entry.acquired
        ? `${menu.collectionText} / 獲得 ${entry.acquiredCount}回`
        : isPending
          ? 'まだ獲得していません'
          : 'まだ出会っていません';
      const detail = this.add.text(102, y + 32, detailText, {
        fontFamily: FONT_FAMILY,
        fontSize: '10px',
        color: entry.acquired ? '#25313f' : '#8895a3',
        wordWrap: { width: 210 },
      });

      const icon = isHidden ? undefined : drawMenuIcon(this, 64, y + 30, menu.id, 0.55);
      if (icon && isPending) icon.setAlpha(0.45);
      this.listContainer.add(icon ? [row, icon, rarityTag, name, detail] : [row, rarityTag, name, detail]);
      y += 60;
    }

    this.maxScrollY = Math.max(0, y - 438);
    this.setupScrolling();

    this.add.text(GAME_WIDTH / 2, 590, '上下にドラッグして一覧を見る', {
      fontFamily: FONT_FAMILY,
      fontSize: '12px',
      color: '#fff8e8',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    new Button(this, GAME_WIDTH / 2, 616, 220, 42, 'タイトルへ戻る', () => {
      this.scene.start(SceneKeys.Title);
    }, { fillColor: COLORS.navy, fontSize: 16 });
  }

  private setupScrolling(): void {
    const hitArea = this.add.rectangle(GAME_WIDTH / 2, 356, 330, 444, 0xffffff, 0);
    hitArea.setInteractive();
    hitArea.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.lastPointerY = pointer.y;
    });
    hitArea.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.dragging) return;
      const delta = pointer.y - this.lastPointerY;
      this.lastPointerY = pointer.y;
      this.setScroll(this.scrollY - delta);
    });
    hitArea.on('pointerup', () => {
      this.dragging = false;
    });
    hitArea.on('pointerout', () => {
      this.dragging = false;
    });
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _objects: unknown[], _dx: number, dy: number) => {
      this.setScroll(this.scrollY + dy * 0.45);
    });
  }

  private setScroll(value: number): void {
    this.scrollY = Phaser.Math.Clamp(value, 0, this.maxScrollY);
    this.listContainer?.setY(144 - this.scrollY);
  }
}
