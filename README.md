# 給食おかわり争奪戦

平成学校ゲームズ第二弾。給食時間の人気メニューおかわりをめぐる、16bit風スマホ向けブラウザミニゲームです。

合図に合わせて「並ぶ！」を押し、残り1個になったらじゃんけんで勝負します。1プレイ30〜60秒程度で遊べるMVPです。

## Published URL

https://kyusyoku-okawari.vercel.app/

Vercel環境変数の `VITE_SITE_URL` も同じURLに設定します。

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
  robots.txt
  sitemap.xml
```

## Game Spec

- 仮想解像度: 360 x 640
- 形式: タイミングタップ + じゃんけん型
- メニュー: カレー、揚げパン、プリン
- 結果: 成功、最後の1個成功、売り切れ、じゃんけん敗北、フライング
- SNS向けコピー表示とコピー操作に対応
- トップページ、遊び方、プライバシーポリシー、利用規約、お問い合わせページを含む公開向け構成

## Controls

1. 「おかわり開始！」の合図を待つ
2. タイミングよく「並ぶ！」を押す
3. 残り1個ならグー・チョキ・パーでじゃんけん
4. リザルト画面からリトライまたはタイトルへ戻る

## Notes

- ゲームプレイ画面、じゃんけん画面、リザルト画面に広告枠はありません。
- OGP、canonical、sitemap、robotsのURLは `https://kyusyoku-okawari.vercel.app/` に合わせています。
- Google AnalyticsはMeasurement ID未設定なら読み込まれません。
- AdSenseのサイト審査用scriptは `index.html` の `head` に設置済みです。広告ユニットは追加していません。
- `.env` / `.env.local` / `.env.production` はコミットしません。公開用の値はVercel環境変数で管理します。

## Environment Variables

```bash
VITE_SITE_URL=https://kyusyoku-okawari.vercel.app
VITE_GA_MEASUREMENT_ID=
VITE_GOOGLE_SITE_VERIFICATION=
```

- `VITE_SITE_URL`: canonical、OGP、sitemap、robotsで使う公開URL
- `VITE_GA_MEASUREMENT_ID`: GA4 Measurement ID。未設定ならGAタグもイベントも送信されません
- `VITE_GOOGLE_SITE_VERIFICATION`: Search ConsoleのHTML meta認証コード。未設定ならmetaタグは出ません

## Search Console登録手順

1. Google Search Consoleを開く
2. URLプレフィックスでVercel URLを登録
3. HTML metaタグ認証を選択
4. 取得した verification code を `VITE_GOOGLE_SITE_VERIFICATION` に設定
5. Vercel環境変数にも同じ値を登録
6. 再デプロイ
7. Search Consoleで確認
8. `sitemap.xml` を送信

## Google Analytics導入手順

1. GA4プロパティを作成
2. Measurement IDを取得
3. `VITE_GA_MEASUREMENT_ID` に設定
4. Vercel環境変数にも同じ値を登録
5. 再デプロイ
6. GA4のリアルタイムレポートで確認

送信イベント:

- `page_view`
- `game_start`
- `menu_revealed`
- `timing_tap`
- `janken_start`
- `janken_win`
- `janken_lose`
- `result_view`
- `share_copy_click`
- `retry_click`

個人情報、ログイン情報、ユーザー識別情報は送信しません。

## AdSense申請前チェック

- AdSenseコード設置済み
- ゲーム内広告なし
- 操作ボタン付近の広告なし
- リザルト画面広告なし
- トップページがある
- 遊び方ページがある
- 攻略・メニュー紹介・シリーズ紹介コンテンツがある
- プライバシーポリシーがある
- 利用規約がある
- お問い合わせページがある
- OGP / SEOメタ情報がある
- `sitemap.xml` と `robots.txt` がある
- 誤クリック誘導がない
- スマホ表示が崩れていない

## 広告配置方針

広告を置いてよい将来候補:

- トップページ下部
- 遊び方ページ本文下
- 攻略ページ
- メニュー紹介ページ
- 開発ログページ
- シリーズ紹介ページ

広告を置かない場所:

- ゲームプレイ画面
- TimingScene
- JankenScene
- ResultScene
- 操作ボタン付近
- ローディング画面
- 画面遷移直後

## Future Ideas

- 正式ドット絵アセットへの差し替え
- 効果音とBGMの追加
- メニュー追加
- ランディングページ、遊び方ページ、攻略ページの追加
