import { Module } from 'vuex';
import { IRootState } from '../types';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const namespaced: boolean = true;

export const AuthModule: Module<typeof state, IRootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};

export default AuthModule;
