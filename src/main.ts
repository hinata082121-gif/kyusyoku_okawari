import Phaser from 'phaser';
import './styles/global.css';
import { gameConfig } from './game/config';
import { buildAbsoluteUrl, siteConfig } from './config/site';

const app = document.querySelector<HTMLElement>('#app');
let game: Phaser.Game | undefined;

type RouteKey =
  | '/'
  | '/game'
  | '/how-to-play'
  | '/privacy'
  | '/terms'
  | '/contact'
  | '/strategy'
  | '/menus'
  | '/series';

const pageMeta: Record<RouteKey, { title: string; description: string }> = {
  '/': {
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
  },
  '/game': {
    title: 'ゲームプレイ｜給食おかわり争奪戦',
    description:
      '「おかわり開始！」の合図に合わせて並ぶボタンを押し、残り1個ならじゃんけんで勝負する短時間ブラウザゲームです。',
  },
  '/how-to-play': {
    title: '遊び方｜給食おかわり争奪戦',
    description: '給食おかわり争奪戦の遊び方。合図を待って並び、最後の1個はじゃんけんで勝負します。',
  },
  '/privacy': {
    title: 'プライバシーポリシー｜給食おかわり争奪戦',
    description: '給食おかわり争奪戦のプライバシーポリシーです。Cookie、アクセス解析、広告配信に関する方針を掲載しています。',
  },
  '/terms': {
    title: '利用規約｜給食おかわり争奪戦',
    description: '給食おかわり争奪戦の利用規約です。無料ブラウザゲームとしての利用条件を掲載しています。',
  },
  '/contact': {
    title: 'お問い合わせ｜給食おかわり争奪戦',
    description: '給食おかわり争奪戦および平成学校ゲームズに関するお問い合わせ・運営者情報です。',
  },
  '/strategy': {
    title: '攻略のコツ｜給食おかわり争奪戦',
    description: '給食おかわり争奪戦の攻略のコツ。フライングを避け、メニューごとの特徴を活かしておかわりを狙いましょう。',
  },
  '/menus': {
    title: '給食メニュー紹介｜給食おかわり争奪戦',
    description: 'カレー、揚げパン、プリンの人気度や難易度、給食あるあるコメントを紹介します。',
  },
  '/series': {
    title: '平成学校ゲームズ｜給食おかわり争奪戦',
    description: '平成の学校あるあるを16bit風ミニゲームとして楽しむ、平成学校ゲームズの紹介ページです。',
  },
};

function getRoute(): RouteKey {
  const path = window.location.pathname;
  if (path in pageMeta) {
    return path as RouteKey;
  }
  return '/';
}

function navigate(route: RouteKey): void {
  window.history.pushState({}, '', route);
  render();
}

function render(): void {
  const route = getRoute();
  updateMeta(route);

  if (!app) return;
  game?.destroy(true);
  game = undefined;
  app.innerHTML = '';
  document.body.classList.toggle('game-mode', route === '/game');
  document.body.classList.toggle('site-mode', route !== '/game');

  if (route === '/game') {
    const gameRoot = document.createElement('div');
    gameRoot.id = 'game-root';
    app.appendChild(gameRoot);
    game = new Phaser.Game({ ...gameConfig, parent: gameRoot });
    return;
  }

  app.innerHTML = getPageHtml(route);
  app.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href') as RouteKey | null;
      if (href) navigate(href);
    });
  });
}

function updateMeta(route: RouteKey): void {
  const meta = pageMeta[route];
  const url = buildAbsoluteUrl(route === '/' ? '/' : route);
  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', siteConfig.keywords);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', buildAbsoluteUrl('/ogp.svg'));
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:image', buildAbsoluteUrl('/ogp.svg'));
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
  updateGoogleSiteVerification();
}

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.setAttribute('content', content);
}

function getPageHtml(route: RouteKey): string {
  if (route === '/how-to-play') return renderPage('遊び方', renderHowToPlay());
  if (route === '/privacy') return renderPage('プライバシーポリシー', renderPrivacy());
  if (route === '/terms') return renderPage('利用規約', renderTerms());
  if (route === '/contact') return renderPage('お問い合わせ・運営者情報', renderContact());
  if (route === '/strategy') return renderPage('攻略のコツ', renderStrategy());
  if (route === '/menus') return renderPage('給食メニュー紹介', renderMenus());
  if (route === '/series') return renderPage('平成学校ゲームズ', renderSeries());
  return renderHome();
}

function renderHome(): string {
  return `
    <div class="site-shell">
      ${renderHeader()}
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">平成学校ゲームズ 第二弾</p>
          <h1>給食おかわり争奪戦</h1>
          <p class="lead">最後のプリン、取れるか。</p>
          <p class="summary">
            給食時間の人気メニューおかわりをめぐる、平成学校あるある16bit風ミニゲームです。
            「おかわり開始！」の合図に合わせてタイミングよく並び、残り1個になったらじゃんけんで勝負。
            カレー、揚げパン、プリンを勝ち取って、クラスの英雄を目指しましょう。
          </p>
          <div class="action-row">
            <a class="primary-link" href="/game" data-route>ゲームをはじめる</a>
            <a class="secondary-link" href="/how-to-play" data-route>遊び方を見る</a>
          </div>
        </div>
        <div class="preview-frame" aria-label="ゲームのスクリーンショット風プレビュー">
          <img src="/ogp.svg" alt="給食おかわり争奪戦の16bit風プレビュー" />
        </div>
      </section>
      <section class="content-grid" aria-label="ゲーム概要">
        <article>
          <h2>短時間で遊べる</h2>
          <p>1プレイは30〜60秒ほど。スマホで片手操作しやすいテンポのミニゲームです。</p>
        </article>
        <article>
          <h2>タイミング勝負</h2>
          <p>先生の合図を待って「並ぶ！」をタップ。早すぎるとフライングです。</p>
        </article>
        <article>
          <h2>最後はじゃんけん</h2>
          <p>残り1個になったら、グー・チョキ・パーでクラスメイトと勝負します。</p>
        </article>
      </section>
      <section class="result-section">
        <h2>ゲームの流れ</h2>
        <p>
          まず今日の人気メニューを確認し、先生の「おかわり開始！」の合図を待ちます。
          下部の大きな「並ぶ！」ボタンを押すと反応時間から列順位が決まり、残り数に入れればおかわり成功。
          残り1個の場面では、じゃんけんで最後の一皿をかけた勝負になります。
        </p>
      </section>
      <section class="content-grid" aria-label="登場メニュー概要">
        <article>
          <h2>カレー</h2>
          <p>王道の人気メニュー。残り数は比較的多く、初めてでも狙いやすいバランス型です。</p>
        </article>
        <article>
          <h2>揚げパン</h2>
          <p>合図直後の早押しが大事。少し出遅れるだけで教室の空気が変わります。</p>
        </article>
        <article>
          <h2>プリン</h2>
          <p>争奪戦の主役。残り1個のじゃんけんに発展しやすい、スクショ映えメニューです。</p>
        </article>
      </section>
      <section class="result-section">
        <h2>スクショしたくなるリザルト</h2>
        <p>
          成功しても失敗しても、結果画面には称号とSNS向けコピーが表示されます。
          給食の小さな勝負を、ラスボス戦みたいに大げさに楽しめます。
        </p>
      </section>
      <section class="content-grid" aria-label="追加コンテンツ">
        <article>
          <h2>攻略のコツ</h2>
          <p>フライングを避け、メニューごとの特徴を知ると勝ちやすくなります。</p>
          <p><a href="/strategy" data-route>攻略を見る</a></p>
        </article>
        <article>
          <h2>メニュー紹介</h2>
          <p>カレー、揚げパン、プリンの人気度や給食あるあるを紹介します。</p>
          <p><a href="/menus" data-route>メニューを見る</a></p>
        </article>
        <article>
          <h2>シリーズ紹介</h2>
          <p>平成の学校あるあるを短時間ゲームとして楽しむシリーズです。</p>
          <p><a href="/series" data-route>シリーズを見る</a></p>
        </article>
      </section>
      ${renderFooter()}
    </div>
  `;
}

function renderPage(title: string, body: string): string {
  return `
    <div class="site-shell">
      ${renderHeader()}
      <main class="page-card">
        <h1>${title}</h1>
        ${body}
      </main>
      ${renderFooter()}
    </div>
  `;
}

function renderHowToPlay(): string {
  return `
    <ol class="steps">
      <li>今日の人気メニューを確認します。</li>
      <li>先生の「おかわり開始！」の合図を待ちます。</li>
      <li>合図が出たら、画面下部の「並ぶ！」をタイミングよく押します。</li>
      <li>押した速さで列順位が決まり、残りおかわり数と比べて結果が分かれます。</li>
      <li>残り1個なら、グー・チョキ・パーでクラスメイトとじゃんけんします。</li>
      <li>勝てばおかわり成功。負けてもリトライして次の給食に挑戦できます。</li>
      <li>結果画面には称号とシェア用コピーが出るので、スクショ共有にも向いています。</li>
    </ol>
    <p>フライングすると先生に止められます。合図をよく見て、人気メニューを勝ち取りましょう。</p>
    <p><a class="primary-link inline-link" href="/game" data-route>ゲームをはじめる</a></p>
  `;
}

function renderPrivacy(): string {
  return `
    <p>当サイトは、無料ブラウザゲーム「給食おかわり争奪戦」を提供するサイトです。</p>
    <h2>取得する可能性のある情報</h2>
    <p>アカウント登録やゲーム内での個人情報入力機能はありません。当サイトは、個人を特定する情報を意図的に収集しません。</p>
    <h2>アクセス解析について</h2>
    <p>当サイトでは、利用状況の把握と改善のためGoogle Analytics 4を利用しています。Cookieなどを通じて閲覧ページ、利用環境、ゲーム内イベント情報などを取得することがあります。これらはサイト改善と利用状況分析のために利用します。</p>
    <h2>広告配信について</h2>
    <p>当サイトでは、Google AdSenseのサイト審査および将来的な広告配信のため、Googleが提供する広告関連スクリプトを設置する場合があります。広告配信事業者がCookieを使用し、利用者の興味に応じた広告を表示する場合があります。現時点でゲーム画面、操作ボタン付近、リザルト画面に広告枠は設置していません。</p>
    <h2>Cookieについて</h2>
    <p>Cookieはブラウザ設定で無効にできます。ただし、アクセス解析や一部機能が正常に動作しない場合があります。</p>
    <h2>外部サービスについて</h2>
    <p>Google Analyticsや広告配信サービスなど外部サービスを利用する場合、各サービス提供者が情報を取得することがあります。詳細は各サービスのポリシーをご確認ください。</p>
    <h2>第三者提供について</h2>
    <p>法令に基づく場合を除き、取得した個人情報を本人の同意なく第三者へ提供しません。</p>
    <h2>免責事項</h2>
    <p>当サイトの内容は予告なく変更・停止する場合があります。利用により生じた損害について、運営者は可能な範囲で責任を負わないものとします。</p>
    <h2>お問い合わせ・改定</h2>
    <p>お問い合わせはお問い合わせページをご確認ください。本ポリシーは必要に応じて改定します。</p>
    <p>制定日: 2026年5月19日 / 最終改定日: 2026年5月20日</p>
  `;
}

function renderTerms(): string {
  return `
    <p>本規約は、無料ブラウザゲーム「給食おかわり争奪戦」の利用条件を定めるものです。</p>
    <h2>利用について</h2>
    <p>利用者は、本規約に同意したうえで当サイトを利用するものとします。現時点でアカウント登録や課金機能はありません。</p>
    <h2>禁止事項</h2>
    <p>不正アクセス、過度な負荷をかける行為、コンテンツの無断転載、第三者に迷惑をかける行為を禁止します。</p>
    <h2>免責事項</h2>
    <p>当サイトは、動作の完全性や継続提供を保証するものではありません。利用により生じた損害について、運営者は可能な範囲で責任を負わないものとします。</p>
    <h2>変更・停止</h2>
    <p>ゲーム内容やサイト構成は、予告なく変更または停止する場合があります。</p>
    <h2>著作権</h2>
    <p>当サイト内のゲーム、文章、画像、プログラム等の権利は、運営者または正当な権利者に帰属します。</p>
    <h2>外部リンク</h2>
    <p>外部サイトの内容や安全性について、当サイトは責任を負いません。</p>
    <h2>規約変更</h2>
    <p>本規約は必要に応じて改定します。改定後の規約は当ページに掲載した時点で効力を持つものとします。</p>
  `;
}

function renderContact(): string {
  return `
    <dl class="info-list">
      <dt>サイト名</dt>
      <dd>給食おかわり争奪戦</dd>
      <dt>シリーズ</dt>
      <dd>平成学校ゲームズ</dd>
      <dt>運営者</dt>
      <dd>平成学校ゲームズ運営</dd>
      <dt>お問い合わせ方法</dt>
      <dd>現在、専用フォームを準備中です。権利確認や重要な連絡が必要な場合は、公開リポジトリまたは運営者プロフィールの連絡先からお問い合わせください。</dd>
    </dl>
    <p>返信が必要な内容でも、内容や確認状況によって返信できない場合があります。スパム対策のため、メールアドレスを掲載する場合は一部を置き換えた表記にすることがあります。</p>
  `;
}

function renderStrategy(): string {
  return `
    <ul class="steps">
      <li>「おかわり開始！」の合図前に押すとフライングになります。</li>
      <li>合図直前の「まだ押すな…！」で焦らず、表示が切り替わる瞬間を狙いましょう。</li>
      <li>早く押すほど列の前に並びやすくなります。</li>
      <li>プリンはじゃんけんになりやすい象徴的メニューです。</li>
      <li>揚げパンは早押しが重要です。</li>
      <li>カレーはバランス型で初心者にも狙いやすいメニューです。</li>
      <li>失敗してもリトライして、称号やシェア用コピーを集める感覚で楽しめます。</li>
      <li>結果画面はスクショ共有におすすめです。</li>
    </ul>
    <p><a class="primary-link inline-link" href="/game" data-route>攻略を試す</a></p>
  `;
}

function renderMenus(): string {
  return `
    <section class="menu-list">
      <article>
        <h2>カレー</h2>
        <p>人気度: 高 / 難易度: 普通 / じゃんけん発生: 中</p>
        <p>給食の王道人気メニュー。残り数は比較的多めですが、クラス全体の注目度も高く、油断すると列の後ろに回ってしまいます。初心者にもおすすめのバランス型です。</p>
      </article>
      <article>
        <h2>揚げパン</h2>
        <p>人気度: 高 / 難易度: 高 / じゃんけん発生: 中</p>
        <p>早押し勝負になりやすいメニュー。合図の直後に素早く動くことが重要で、少しの出遅れが結果に響きます。</p>
      </article>
      <article>
        <h2>プリン</h2>
        <p>人気度: 最大 / 難易度: 普通 / じゃんけん発生: 高</p>
        <p>残り1個をめぐるじゃんけん勝負が起きやすい、争奪戦の主役級メニューです。勝っても負けても結果画面の一言が映えます。</p>
      </article>
    </section>
  `;
}

function renderSeries(): string {
  return `
    <p>平成学校ゲームズは、平成の学校あるあるを16bit風の短時間ミニゲームとして楽しむシリーズです。</p>
    <p>第二弾「給食おかわり争奪戦」では、給食時間の小さな勝負を大げさなバトル演出で描きます。</p>
    <p>今後は学校行事、休み時間、掃除当番など、懐かしいテーマのゲーム追加を検討しています。</p>
  `;
}

function renderHeader(): string {
  return `
    <header class="site-header">
      <a class="brand" href="/" data-route>平成学校ゲームズ</a>
      <nav aria-label="サイト内ナビゲーション">
        <a href="/game" data-route>ゲーム</a>
        <a href="/how-to-play" data-route>遊び方</a>
        <a href="/strategy" data-route>攻略</a>
        <a href="/privacy" data-route>プライバシー</a>
      </nav>
    </header>
  `;
}

function renderFooter(): string {
  return `
    <footer class="site-footer">
      <nav aria-label="フッターナビゲーション">
        <a href="/" data-route>トップ</a>
        <a href="/game" data-route>ゲームを遊ぶ</a>
        <a href="/how-to-play" data-route>遊び方</a>
        <a href="/strategy" data-route>攻略のコツ</a>
        <a href="/menus" data-route>登場メニュー</a>
        <a href="/privacy" data-route>プライバシーポリシー</a>
        <a href="/terms" data-route>利用規約</a>
        <a href="/contact" data-route>お問い合わせ</a>
        <a href="/series" data-route>平成学校ゲームズ</a>
      </nav>
      <p>© 2026 平成学校ゲームズ</p>
    </footer>
  `;
}

function updateGoogleSiteVerification(): void {
  const selector = 'meta[name="google-site-verification"]';
  document.querySelector(selector)?.remove();
  if (!siteConfig.googleSiteVerification) return;

  const meta = document.createElement('meta');
  meta.name = 'google-site-verification';
  meta.content = siteConfig.googleSiteVerification;
  document.head.appendChild(meta);
}

window.addEventListener('popstate', render);
render();
