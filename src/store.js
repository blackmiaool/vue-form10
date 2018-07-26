import Vue from 'vue';
import Vuex from 'vuex';
import * as VueDeepSet from 'vue-deepset';

Vue.use(VueDeepSet);
Vue.use(Vuex);
export default () => new Vuex.Store({
    state: {
        model: null,
        selected: null,
        inherit: {}
    },
    mutations: {
        mergeState(state, target) {
            if (!target) {
                return;
            }
            state.inherit = { ...target };
        },
        setModel(state, { path, value }) {
            if (path) {
                VueDeepSet.vuexSet(path, value);
            } else {
                state.model = value;
            }
        },
        remove(state, path) {
            let obj = state;
            path.forEach((section, i) => {
                if (i !== path.length - 1) {
                    obj = obj[section];
                } else {
                    Vue.delete(obj, section);
                }
            });
        },
        setSelected(state, path) {
            state.selected = path;
        },
        VUEX_DEEP_SET: VueDeepSet.VUEX_DEEP_SET,
    }
});
