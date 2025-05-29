# ts-react-template

React + TypeScript + Vite を使用した開発のためのテンプレートリポジトリです。すぐに開発を始められるように必要な設定が整っています。

## 概要

このテンプレートは以下の技術スタックを使用しています：

- **React** - UIライブラリ
- **TypeScript** - 静的型付け
- **Vite** - 高速な開発環境とビルドツール ([公式サイト](https://ja.vitejs.dev/))
- **React Router** - ページナビゲーション ([チュートリアル](https://reactrouter.com/en/main/start/tutorial))

## 始め方

### リポジトリのクローン

```bash
git clone git@github.com:Buntamatsushita/ts-react-template.git
cd ts-react-template
```

### Node.js バージョン管理

このプロジェクトでは [Volta](https://docs.volta.sh/guide/) を使用してNode.jsのバージョンを管理することをお勧めします。

```bash
# Voltaをインストールしていない場合はインストールしてください
# Voltaで特定のNodeバージョンをインストール
volta install node@20.12.2
```

### 依存関係のインストールと開発サーバーの起動

```bash
# 依存関係のインストール
npm install
# または、厳密なバージョン一致でインストール
npm ci

# 開発サーバーの起動
npm run dev
```

開発サーバーが起動したら、ブラウザで `http://localhost:5173` にアクセスしてアプリケーションを確認できます。

## ライブラリの追加

### Material UI (MUI) のインストール

UIコンポーネントライブラリとして [Material UI (MUI)](https://mui.com/) を追加する例：

```bash
# MUI コアパッケージと関連パッケージのインストール
npm install @mui/material @emotion/react @emotion/styled

# アイコン（オプション）
npm install @mui/icons-material

# または一括インストール
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

#### MUIの使い方の例

`src/pages/index.tsx` ファイルでMUIコンポーネントを使用する簡単な例：

```tsx
import { Button, Typography, Container, Box } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Material UI サンプル
        </Typography>
        <Button variant="contained" color="primary">
          クリックしてください
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
```

テーマのカスタマイズ (`src/main.tsx` に追加):

```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

// Appコンポーネント内
<ThemeProvider theme={theme}>
  {/* アプリケーションの内容 */}
</ThemeProvider>
```

## 推奨VSCode拡張機能

このプロジェクトでの開発を効率化するために、以下のVSCode拡張機能をインストールすることをお勧めします：

- **Japanese Language Pack for Visual Studio Code** - VS Codeの日本語化
- **ESLint** - コード品質のチェック
- **IntelliCode** - AIによるコード補完
- **Trailing Spaces** - 余分な空白の検出
- **Prettier - Code formatter** - コードフォーマット
- **npm Intellisense** - npmモジュールのインポート補完
- **JavaScript and TypeScript Nightly** - 最新のJS/TS機能サポート
- **vscode-styled-components** - styled-componentsのシンタックスハイライト

## プロジェクト構成

```
ts-react-template/
├── public/           # 静的ファイル
├── src/
│   ├── assets/       # 画像などのアセット
│   ├── components/   # 再利用可能なコンポーネント
│   ├── pages/        # ページコンポーネント
│   ├── main.tsx      # アプリケーションのエントリポイント
│   └── vite-env.d.ts # Viteの型定義
├── index.html        # HTMLテンプレート
├── package.json      # 依存関係と設定
├── tsconfig.json     # TypeScript設定
├── vite.config.ts    # Vite設定
└── README.md         # 本ドキュメント
```
