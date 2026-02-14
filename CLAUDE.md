# CLAUDE.md

## プロジェクト概要
本棚 (Hondana) - ISBNバーコードスキャンで書籍情報を自動取得し、ブラウザ内で本を管理するPWAアプリ。

## 技術スタック
- React 19 + TypeScript (Vite 7)
- IndexedDB (Dexie.js) - ブラウザ内データ永続化
- Google Books API - ISBN → 書籍情報取得 (APIキー不要)
- html5-qrcode - カメラバーコード読み取り
- vite-plugin-pwa - Service Worker / オフライン対応

## コマンド
- `npm run dev` — 開発サーバー起動
- `npm run build` — TypeScript型チェック + 本番ビルド + PWA生成
- `npm run preview` — 本番ビルドをプレビュー
- `npm run lint` — ESLint実行

## デプロイ
- GitHub Pages: https://araki-m.github.io/hondana/
- `main` ブランチへの push で GitHub Actions が自動デプロイ (`.github/workflows/deploy.yml`)
- ルーティングは `HashRouter` を使用 (GitHub Pages のサブパス対応)
- Vite の `base` は `/hondana/` に設定

## バージョン管理
- `package.json` の `version` と `src/pages/BookListPage.tsx` のバージョン表示を両方更新すること
- PWAキャッシュがあるため、バージョンを上げないとユーザーに変更が反映されない場合がある

## ディレクトリ構成
```
src/
├── types/book.ts          # Book型定義
├── db/db.ts               # Dexie DBスキーマ
├── api/googleBooks.ts     # Google Books API
├── hooks/useBooks.ts      # CRUD + useLiveQueryフック
├── components/            # 再利用コンポーネント
│   ├── Layout.tsx         # ヘッダー + BottomNav + Outlet
│   ├── BottomNav.tsx      # 下部3タブナビ
│   ├── BookCard.tsx       # 本カード
│   ├── BookGrid.tsx       # グリッドレイアウト
│   ├── SearchBar.tsx      # デバウンス検索
│   ├── Scanner.tsx        # カメラバーコードスキャナ
│   └── ConfirmDialog.tsx  # 削除確認ダイアログ
└── pages/                 # ページコンポーネント
    ├── BookListPage.tsx   # 本棚一覧 + 検索 + バージョン表示
    ├── ScanPage.tsx       # スキャン → API → 登録フロー
    ├── BookFormPage.tsx   # 手動登録・編集フォーム
    └── BookDetailPage.tsx # 詳細 + 編集・削除
```

## 設計方針
- モバイルファースト (max-width 480px)
- UIテキストはすべて日本語
- グローバルCSS (`App.css`) でスタイリング (CSS変数による暖色系テーマ)
- ISBNは978/979で始まる13桁のみ有効 (書籍バーコードのみ受付)
- ISBN重複チェックあり (スキャン時にDB確認)
- Google Books APIで情報不足の場合は手動入力にフォールバック

## 既知の注意点
- Scanner コンポーネントはアンマウントせず `display:none` で非表示にする (html5-qrcode の DOM 操作と React の競合を回避するため)
- Scanner 内で `scanner.stop()` を await してから `scanner.clear()` を実行すること
