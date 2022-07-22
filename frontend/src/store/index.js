import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const actions = {

}

const mutations = {
    SET_NEWS(state, news) {
        state.news = news
    }
}

const state = {
    news: []
}

const getters = {
    getNews(state) {
        return state.news
    }
}

export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})
