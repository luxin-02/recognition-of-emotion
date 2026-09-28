module.exports = {
    root: true,
    // 使用 vue-eslint-parser 解析 .vue 文件（依赖已安装），
    // 否则 ESLint 会把 <template> 当普通 JS，报 "Unexpected token <"
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    // 本项目为纯 JS 项目，暂不启用 @typescript-eslint
    // （该插件依赖的 typescript 未安装，会导致 lint 直接加载失败）。
    // 如以后引入 TS：先 npm i -D typescript，再启用下面配置。
    // extends: [
    //     'plugin:@typescript-eslint/recommended',
    // ],
    // plugins: ['@typescript-eslint'],
    // parserOptions: {
    //     parser: '@typescript-eslint/parser', // 解析 .ts 文件
    // },
    // rules: {
    //     "@typescript-eslint/explicit-module-boundary-types":"off"
    // }
}
