import Vue from 'vue';
import Vuex from 'vuex';
import AboutModule from './about';
import AuthModule from './auth';
import SettingModule from './setting';
import SolutionModule from './solution';
import { IRootState } from './types';

Vue.use(Vuex);

export const store = new Vuex.Store<IRootState>({
    // the strict:true force to preventing any state changes without mutaions
    //      but strict be true >>
    //      if bind a property of state such as mainNav.clipped to a ui element
    //      and it changed the mainNav.clipped then it cause and error
    strict: false,
    // =======================================================================================================
    modules: {
        setting: SettingModule,
        about: AboutModule,
        auth: AuthModule,
        solution: SolutionModule,
    },
});
