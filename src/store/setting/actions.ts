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
import { ActionTree } from 'vuex';
import { IRootState } from '../types';
import SettingState from './state';
import * as types from './types';
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');

const defaultCommitOptions = {
    root: true,
};

const actions: ActionTree<typeof SettingState, IRootState> = {
    saveSettings: (context, settingsModel: ISettings) => {
        // TODO: should save settings then commit the new states to be changed by the relative mutation
        // TODO: must be changed to save all settings
        appConfigStore.set('darkTheme', settingsModel.ui.isDarkTheme);
        context.commit(
            types.MutationTypes.setSettings,
            settingsModel,
            defaultCommitOptions
        );
    },

    switchTheme: (context, isDark) => {
        context.commit(
            types.MutationTypes.switchTheme,
            isDark,
            defaultCommitOptions
        );
    },
};

export default actions;
