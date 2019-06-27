import {
    appConfigStore,
    Defaults,
    IAppConf,
    ReadyAppConfig,
} from '@/appConfig';
import {
    IAsset,
    IAssetFlow,
    ILoadedSolution,
    IPrimaryDrawer,
    IProject,
    IProjectFlow,
    IReference,
    IReferenceFlow,
    IResourceFlow,
    ISettings,
    ISolution,
    ISolutionFlow,
    ISolutionMeta,
} from '@/components/CoderplaySolutionTypes';
import fs from 'fs';
import { MutationTree } from 'vuex';
import SettingState from './state';
import * as types from './types';
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');

const mutations: MutationTree<typeof SettingState> = {
    setMainNav: (state, mainNav) => {
        state.model.ui.mainNav.type = mainNav;
    },
    toggleMainNav: state => {
        state.model.ui.mainNav.type =
            state.model.ui.mainNav.type !== '' ? '' : 'permanent';
    },
    hideMainNav: state => {
        state.model.ui.mainNav.type = '';
    },
    showMainNavPermanent: state => {
        state.model.ui.mainNav.type = 'permanent';
    },
    showMainNavTemporary: (state, type) => {
        state.model.ui.mainNav.type = 'temporary';
    },
    setMainNavVisilbility: (state, type) => {
        state.model.ui.mainNav.type = type;
    },
    switchTheme: (state, payload) => {
        appConfigStore.set('darkTheme', payload);
        state.model.ui.isDarkTheme = payload;
    },
    setSettings: (state, settingsModel: ISettings) => {
        state.model = settingsModel;
    },
    openSettings: state => {
        state.dialog.visibility = true;
    },
    closeSettings: state => {
        state.dialog.visibility = false;
    },
};

export default mutations;
