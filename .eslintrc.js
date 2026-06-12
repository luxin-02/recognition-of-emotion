module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    parser: 'vue-eslint-parser', // 解析 .vue 文件
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: '@typescript-eslint/parser', // 解析 .ts 文件
    },
    rules: {
        "@typescript-eslint/explicit-module-boundary-types":"off"
    }
}