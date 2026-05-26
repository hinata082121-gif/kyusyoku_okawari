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
- メニュー: カレー、揚げパン、プリンなど17種類
- レア度: ふつう、ちょいレア、レア、激レア、伝説
- 結果: 成功、最後の1個成功、売り切れ、じゃんけん敗北、フライング
- 給食コレクションをlocalStorageに保存
- SNS向けコピー表示とコピー操作に対応
- トップページ、遊び方、プライバシーポリシー、利用規約、お問い合わせページを含む公開向け構成

## v0.2 追加要素

- 給食メニューの追加
- レア度システム
- レアメニューの低確率出現
- 高レアメニューは強制じゃんけん
- 給食コレクション
- localStorage保存
- コレクション画面
- レア度別のSNS向けリザルト

## 録画専用モード

ショート動画宣伝用に、URLクエリで起動する録画専用モードがあります。通常URLでは通常プレイのままです。

- 勝利デモ: `https://kyusyoku-okawari.vercel.app/?recording=win`
- 敗北デモ: `https://kyusyoku-okawari.vercel.app/?recording=lose`
- ランダムデモ: `https://kyusyoku-okawari.vercel.app/?recording=random`
- コレクション訴求: `https://kyusyoku-okawari.vercel.app/?recording=collection`
- サムネイル静止画: `https://kyusyoku-okawari.vercel.app/?recording=thumbnail`

録画モードは自動進行で、広告枠や操作ボタンは表示しません。GA4では通常プレイの `game_start` / `result_view` と混ざらないように、`promo_view` と `promo_variant` のみを送信します。

詳しい録画手順は [docs/promo-recording-guide.md](docs/promo-recording-guide.md) を参照してください。

## Controls

1. 「おかわり開始！」の合図を待つ
2. タイミングよく「並ぶ！」を押す
3. 残り1個ならグー・チョキ・パーでじゃんけん
4. リザルト画面からリトライまたはタイトルへ戻る

## Notes

- ゲームプレイ画面、じゃんけん画面、リザルト画面に広告枠はありません。
- OGP、canonical、sitemap、robotsのURLは `https://kyusyoku-okawari.vercel.app/` に合わせています。
- GA4タグ本体は `index.html` の `head` に設置済みです。
- AdSenseのサイト審査用scriptは `index.html` の `head` に設置済みです。広告ユニットは追加していません。
- `.env` / `.env.local` / `.env.production` はコミットしません。公開用の値はVercel環境変数で管理します。

## Environment Variables

```bash
VITE_SITE_URL=https://kyusyoku-okawari.vercel.app
VITE_GOOGLE_SITE_VERIFICATION=
```

- `VITE_SITE_URL`: canonical、OGP、sitemap、robotsで使う公開URL
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

## GA4計測イベント

このプロジェクトでは、以下のゲーム内イベントをGA4に送信します。

- `game_start`
- `menu_revealed`
- `timing_tap`
- `janken_start`
- `janken_result`
- `result_view`
- `retry_click`
- `share_copy_click`
- `collection_view`
- `collection_acquired`
- `rare_menu_revealed`
- `promo_view`
- `promo_variant`

送信パラメータ:

- `menu_name`
- `menu_id`
- `result_type`
- `reaction_time_ms`
- `rank`
- `is_flying`
- `janken_result`
- `rarity`
- `acquired_count`

個人情報、ログイン情報、ユーザー識別情報は送信しません。

## 注意

GA4タグ本体は `index.html` に設置しています。
`analytics.ts` ではscriptの追加は行わず、`window.gtag` が存在する場合のみイベントを送信します。

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

## 定期更新内容

今回の更新では、AdSense審査中の軽微なサイト改善として以下を行いました。

- トップページ説明強化
- 遊び方説明強化
- 攻略のコツ追加
- レア度システム説明追加
- 給食メニュー紹介追加
- コレクション機能説明追加
- リザルト・SNS共有紹介追加
- 録画専用モード案内追加
- 平成学校ゲームズシリーズ導線追加
- 第一弾「チャイムまでに帰れ！ / RoukaDash」への導線追加（正式URLは確認後に差し替え）
- privacy / terms / contact 確認
- sitemap.xml / robots.txt 確認
- ゲーム中広告なし方針の維持

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
- 録画専用モード

## Future Ideas

- 正式ドット絵アセットへの差し替え
- 効果音とBGMの追加
- コレクションのフィルター/ページング強化
- ランディングページ、遊び方ページ、攻略ページの追加
