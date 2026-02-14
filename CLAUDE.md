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
    ├── BookListPage.tsx   # 本棚一覧 + 検索
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
