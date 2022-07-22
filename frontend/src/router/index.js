import Vue from 'vue'
import VueRouter from 'vue-router'
import SearchPage from "@/pages/SearchPage";
import NewsPage from "@/pages/NewsPage";
import NewsListPage from "@/pages/NewsListPage";

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: {
                path: '/search'
            }
        },
        {
            path: '/search',
            component: SearchPage
        },
        {
            path: '/news-list/:words/:random',
            component: NewsListPage
        },
        {
            path: '/news/:title',
            component: NewsPage
        }
    ]
})
