# 必要環境
- Node
- Ruby
- Gulp
- Sass
  

# 使用方法
ファイルを作業フォルダに落とす
`git clone`  

パッケージをインストール
`npm i`
  
実行
`gulp`
  

# Gulpタスク
デフォルトタスク
`gulp`
  
ビルドタスク
`gulp build`
  

# ディレクトリ構成
```
.
├── src
│   ├── index.html
│   ├── imges
│   │   ├── common
│   │   └── top
│   ├── js
│   │   ├── lib
│   │   │   ├── jquery.js
│   │   └── common.js
│   └── sass
│       ├── foundation
│       │   ├── _base.scss
│       │   ├── _mixin.scss
│       │   ├── _sanitize.scss
│       │   └── _vars.scss
│       ├── layout
│       │   ├── _footer.scss
│       │   ├── _header.scss
│       │   └── _layout.scss
│       ├── object
│       │   ├── component
│       │   │   ├── _btn.scss
│       │   │   └── _title.scss
│       │   ├── project
│       │   └── utility
│       └── common.scss
├── dist
├── .gitignore
├── README.md
├── package.json
└── gulpfile.js


```
