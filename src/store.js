import Vue from 'vue';
import Vuex from 'vuex';
import * as VueDeepSet from 'vue-deepset';

Vue.use(VueDeepSet);
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        model: null,
    },
    mutations: {
        setModel(state, { path, value }) {
            if (path) {
                VueDeepSet.vuexSet(path, value);
            } else {
                state.model = value;
            }
        },
        VUEX_DEEP_SET: VueDeepSet.VUEX_DEEP_SET,
    }
});