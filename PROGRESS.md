# Product Gallery（プロダクト紹介ダッシュボード） 進捗（2026-07-18時点）

## ゴール（1行）

自作プロダクトを日本語で紹介するカード式ショーケースを `https://olerant-llm.github.io` で公開し、台帳1ファイル（products.json）で運用する。

## 現在地（3行以内）

サイト骨格（index.html / style.css / app.js / products.json）を作成し、6プロダクト分の台帳を記入済み。
GitHub公開（olerant-llm名義）とスクリーンショット撮影はこれから。
yokochika-ugoiteru は404のため掲載保留（ghログイン後に実名確認）。

## 完了済み

- 2026-07-18: 企画確定（olerant-llm名義 / GitHub Pages / MIT / カード7枚構成）
- 2026-07-18: 3プロダクト（ai_coding_status・local_backup・New_editor）の秘密情報スキャン → 実キーなし。local_backup のみ個人パス・13GBの除外が必要
- 2026-07-18: gh CLI 2.96.0 導入（winget）
- 2026-07-18: サイト骨格＋台帳6件作成（ビルド不要の静的サイト、タグ絞り込み・状態バッジ・ダークモード対応）

## 次のアクション（具体的に）

1. ユーザーが `gh auth login` で olerant-llm にログイン → `gh repo list` で yokochika-ugoiteru の実名確認
2. `olerant-llm/olerant-llm.github.io` リポジトリ作成 → push → Pages有効化
3. 3プロダクトを個別リポジトリ化（agent-radar / local-backup / ci-layerwriter）。push前に秘密情報の最終grep必須
4. スクショ撮影（Agent Radar と CI-LayerWriter は自動撮影、LocalBackup はユーザー撮影）→ products.json の image を埋める

## ハマりどころ・約束事

- **親リポジトリ（project全体）は絶対にpushしない**。兄弟フォルダに実APIキーあり（schoolyell / Vibecoding_site / Press_release_system）
- 新規リポジトリの git 記名は `olerant-llm` + `olerant-llm@users.noreply.github.com`（本名・本名メールを履歴に載せない）
- ファイル削除はしない。除外は .gitignore で行う（local_backup の dist/ や manual_test/ など）
- 掲載追加は products.json に1項目足すだけ。HTMLは触らない運用

## 重要ファイル地図

| ファイル | 役割 |
|---|---|
| `products.json` | 台帳。1プロダクト=1項目。ここだけ編集すればカードが増える |
| `app.js` | 台帳を読んでカード描画＋タグ絞り込み |
| `index.html` / `style.css` | 骨格と見た目（ダークモード対応） |
| `assets/` | スクリーンショット置き場（16:9推奨） |
| 計画書 | `~/.claude/plans/glimmering-herding-charm.md` |
