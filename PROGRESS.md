# Product Gallery（プロダクト紹介ダッシュボード） 進捗（2026-07-19セッション終了時点）

## ゴール（1行）

自作プロダクトを日本語で紹介するカード式ショーケースを `https://olerant-llm.github.io` で公開し、台帳1ファイル（products.json）で運用する。

## 現在地（3行以内）

**サイトは本番公開済み・第1弾の残作業ゼロ**: https://olerant-llm.github.io （6カード・タグ絞り込み・3カード画像つき）。
3プロダクトの個別リポジトリ公開も完了（agent-radar / local-backup / ci-layerwriter、いずれもMIT・記名olerant-llm・秘密grepクリア）。
yokochika-ugoiteru は**非公開のまま掲載見送りで確定**（2026-07-18ユーザー裁定・6枚構成）。

## 完了済み

- 2026-07-18: 企画確定（olerant-llm名義 / GitHub Pages / MIT / カード7枚構成）
- 2026-07-18: 3プロダクトの秘密情報スキャン → 実キーなし。ユーザー名入りパスは各リポジトリで汎用表記に置換して公開
- 2026-07-18: gh CLI 2.96.0 導入（winget）・olerant-llmでログイン（記名は olerant-llm@users.noreply.github.com に固定）
- 2026-07-18: サイト骨格＋台帳6件作成 → `olerant-llm/olerant-llm.github.io` として公開・実URL表示確認
- 2026-07-18: agent-radar / local-backup / ci-layerwriter を公開（local_backupは dist/ manual_test/ target/ を除外し公開分142KB）
- 2026-07-18: Agent Radarのスクショは疑似データのデモ起動（別ポート＋偽ホーム方式）で撮影。実ログの個人情報を回避
- 2026-07-19: ユーザー撮影のスクショ2枚（CI-LayerWriter / LocalBackup）を受領・個人情報なし確認 → `assets/` に配置し products.json の `image` を反映
- 2026-07-19: ci-layerwriter のREADME冒頭に `docs/screenshot.png` を追加して push
- 2026-07-19: `.gitignore` 新設（撮影元 `screenshot/` と私的メモを公開対象から除外）
- 2026-07-19: カード詳細モーダル追加（カードクリック→詳しい説明＋GitHub導線。台帳に `details` 欄新設、無ければ description 表示の後方互換。ローカルで開閉・リンク・キーボード操作を検証済み・文面はユーザー承認済み）

## 次のアクション（具体的に）

1. カードの説明文・キャッチコピーの手直しがあれば products.json のみ編集
2. 第2弾以降: 残りプロダクトの掲載・デモリンク追加（yokochika-ugoiteru は非公開のまま見送り。気が変わったら `gh repo edit olerant-llm/yokochika-ugoiteru --visibility public` ＋中身の秘密情報チェック＋台帳追加）

## 裁定リスト

- 裁定1（2026-07-18）: 公開名義は olerant-llm（本名側アカウントは使わない）。サイトは専用一等地 `olerant-llm.github.io`
- 裁定2（2026-07-18）: ライセンスはMIT・第1弾はカード＋GitHubリンクのみ（詳細ページなし）
- 裁定3（2026-07-18）: yokochika-ugoiteru は非公開のまま掲載見送り（6枚構成で確定）
- 裁定4（2026-07-18）: スクショはユーザーが撮影して提供する（CI-LayerWriter / LocalBackup の2枚）

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
| `RUNBOOK.md` | 運用手順書（カード追加・新規公開の全手順。手元専用・非公開） |
| 計画書 | `~/.claude/plans/glimmering-herding-charm.md` |
