// import * as actions from "./actions";
// import * as getters from "./getters";
// import * as mutations from "./mutations";
// import * as types from "./types";

// export default{
// 	actions,
// 	getters,
// 	mutations,
// 	types,
// }

import { Module } from 'vuex';
import { IRootState } from '../types';
import mutations from './mutations';
import state from './state';

const namespaced: boolean = true;

const AboutModule: Module<typeof state, IRootState> = {
    namespaced,
    state,
    getters: undefined,
    actions: undefined,
    mutations,
};

export default AboutModule;
