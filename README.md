# 給食おかわり争奪戦

平成学校ゲームズ第二弾。給食時間の人気メニューおかわりをめぐる、16bit風スマホ向けブラウザミニゲームです。

合図に合わせて「並ぶ！」を押し、残り1個になったらじゃんけんで勝負します。1プレイ30〜60秒程度で遊べるMVPです。

## Tech Stack

- Vite
- TypeScript
- Phaser 3

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Vercelでは静的サイトとして公開します。出力ディレクトリは `dist` です。

## Directory Structure

```text
src/
  main.ts
  game/
    config.ts
    constants.ts
    types.ts
    data/
    scenes/
    systems/
    ui/
  styles/
public/
  ogp.svg
  favicon.svg
```

## Game Spec

- 仮想解像度: 360 x 640
- 形式: タイミングタップ + じゃんけん型
- メニュー: カレー、揚げパン、プリン
- 結果: 成功、最後の1個成功、売り切れ、じゃんけん敗北、フライング
- SNS向けコピー表示とコピー操作に対応

## Controls

1. 「おかわり開始！」の合図を待つ
2. タイミングよく「並ぶ！」を押す
3. 残り1個ならグー・チョキ・パーでじゃんけん
4. リザルト画面からリトライまたはタイトルへ戻る

## Notes

- ゲームプレイ画面、じゃんけん画面、リザルト画面に広告枠はありません。
- OGPのURLはVercel公開後に `index.html` 内の正式URLへ差し替えてください。

## Future Ideas

- 正式ドット絵アセットへの差し替え
- 効果音とBGMの追加
- メニュー追加
- ランディングページ、遊び方ページ、攻略ページの追加
