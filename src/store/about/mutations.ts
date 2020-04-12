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
import AboutState from './state';
import * as types from './types';
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');

const mutations: MutationTree<typeof AboutState> = {
    openAbout: state => {
        state.dialog.visibility = true;
    },
    closeAbout: state => {
        state.dialog.visibility = false;
    },
};

export default mutations;
