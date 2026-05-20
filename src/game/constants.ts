export const GAME_WIDTH = 360;
export const GAME_HEIGHT = 640;

export const SAFE_AREA = {
  top: 16,
  bottom: 14,
  side: 16,
} as const;

export const UI = {
  primaryButtonHeight: 62,
  secondaryButtonHeight: 48,
  bottomPrimaryY: 552,
  bottomSecondaryY: 611,
} as const;

export const COLORS = {
  ink: 0x25313f,
  cream: 0xfff3d6,
  paper: 0xfff8e8,
  chalk: 0xf5ffe9,
  board: 0x1f7a4d,
  boardDark: 0x14583a,
  wood: 0xb97842,
  woodDark: 0x80512f,
  tray: 0xc9d0d8,
  trayDark: 0x8895a3,
  red: 0xe84b4b,
  orange: 0xf38a2e,
  yellow: 0xffd447,
  blue: 0x4f8dd8,
  navy: 0x172a4a,
  green: 0x37ad6b,
  purple: 0x8b5adf,
  white: 0xffffff,
  black: 0x101820,
} as const;

export const FONT_FAMILY = '"Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif';

export const SceneKeys = {
  Boot: 'BootScene',
  Title: 'TitleScene',
  MenuReveal: 'MenuRevealScene',
  Timing: 'TimingScene',
  Queue: 'QueueScene',
  Janken: 'JankenScene',
  Result: 'ResultScene',
  Collection: 'CollectionScene',
} as const;
