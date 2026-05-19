import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import user from './module/user';
import system from './module/system';
import uncommon from './module/uncommon';

Vue.use(Vuex)

export default new Vuex.Store({
    state: () => ({}),
    modules: {
        user,
        system,
        uncommon
    },
    // 配置插件
    plugins: [
        createPersistedState({
            key: 'vuex',
            storage: window.localStorage,
            // 指定需要存储的模块，如果是模块下具体的数据需要加上模块名称，如user.token
            paths: ['user', 'system'],
            getState: (key, storage) => {
                const value = storage.getItem(key);

                let obj = undefined;
                try {
                    obj = (typeof value === "string")
                        ? JSON.parse(value) : (typeof value === "object")
                            ? value : undefined;
                } catch (err) {
                    console.log(err)
                }

                if (obj) {
                    delete obj.user;
                    // 用户数据单独储存在sessionStorage
                    try {
                        const userV = JSON.parse(window.sessionStorage.getItem('vuexuser'));
                        if (userV) {
                            obj.user = userV;
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
                // console.log(obj)

                return obj;
            },
            setState: (key, state, storage) => {
                // 将用户数据单独储存至sessionStorage，使关闭软件后用户信息消失
                if (state.user) {
                    window.sessionStorage.setItem('vuexuser', JSON.stringify(state.user));
                }
                let obj = Object.assign({}, state);
                delete obj.user;

                return storage.setItem(key, JSON.stringify(obj));
            },
        })
    ]
})

