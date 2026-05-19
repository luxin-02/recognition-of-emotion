// postcss 配置文件
module.exports = {
    // 配置需要使用的postcss插件
    plugins: {
        'postcss-pxtorem': { 
            rootValue: 100,   
            propList: ['*']
        }
    }
}
