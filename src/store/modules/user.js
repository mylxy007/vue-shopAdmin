import {
    login,
    logout,
    getInfo
} from '@/api/user'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import {
    resetRouter,
    asyncRoutes,
    anyRoutes,
    constantRoutes
} from '@/router'
import router from '@/router'
const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        routes: [],
        roles: [],
        buttons: [],
        // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
        resultAsyncRoutes: [],
        // 用户最终需要展示的全部路由
        resultAllRoutes: [],
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
        // 用户名
        state.name = userInfo.name;
        // 用户头像
        state.avatar = userInfo.avatar;
        // 菜单权限标记
        state.routes = userInfo.routes;
        // 按钮权限标记
        state.buttons = userInfo.buttons;
        // 角色
        state.roles = userInfo.roles
    },
    SET_RESULTASYNCROUTES(state, asyncRoutes) {
        state.resultAsyncRoutes = asyncRoutes;
        // 计算出当前用户需要展示的所有路由
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
        router.addRoutes(state.resultAllRoutes)
    }
}
// 定义一个函数：两个数组进行对比，对比出当前用户到底显示那些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
    // 过滤出当前用户
    return asyncRoutes.filter(item => {
        if (routes.indexOf(item.name) !== -1) {
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes);
            }
            return true;
        }
    })
}
const actions = {
    // user login
    async login({
        commit
    }, userInfo) {
        const {
            username,
            password
        } = userInfo
        const result = await login({
            username: username.trim(),
            password: password
        });

        if (result.code == 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        }
        return Promise.reject(new Error('faile'));
    },

    // get user info
    getInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const {
                    data
                } = response

                if (!data) {
                    return reject('Verification failed, please Login again.')
                }
                commit('SET_USERINFO', data);
                commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
