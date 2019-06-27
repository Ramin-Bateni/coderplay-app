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
import * as settingsTypes from '../setting/types';
import { IRootState } from '../types';
import SolutionState from './state';
import * as solutionTypes from './types';
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');
const defaultCommitOptions = {
    root: true,
};
const actions: ActionTree<typeof SolutionState, IRootState> = {
    loadSolutionFromFile: (context, filePath: string) => {
        const rawdata = fs.readFileSync(filePath).toString();
        const solution = JSON.parse(rawdata) as ILoadedSolution;
        // filling meta properties
        try {
            solution.meta = {} as ISolutionMeta;
            solution.meta.loadId = uuidV4();
            solution.meta.lastSavedOn = new Date();
            solution.meta.filePath = filePath;
            solution.meta.isModified = false;
            solution.meta.isSelected = true;
        } finally {
            solution.meta.lastSavedSnapshot = Object.assign({}, solution);
        }

        context.commit(
            solutionTypes.MutationTypes.openSolution,
            solution,
            defaultCommitOptions
        );
        // debugger;
        context.commit(
            settingsTypes.MutationTypes.showMainNavPermanent,
            null,
            defaultCommitOptions
        );
    },

    openSolution: (context, loadedSolution: string) => {
        context.commit(
            solutionTypes.MutationTypes.openSolution,
            loadedSolution,
            defaultCommitOptions
        );
        context.commit(
            settingsTypes.MutationTypes.showMainNavPermanent,
            null,
            defaultCommitOptions
        );
    },

    closeSolution: (context, solutionloadId: string) => {
        context.commit(
            solutionTypes.MutationTypes.closeSolution,
            solutionloadId,
            defaultCommitOptions
        );
        context.commit(
            settingsTypes.MutationTypes.hideMainNav,
            solutionloadId,
            defaultCommitOptions
        );
    },

    closeAllSolutions: (context, solutionloadId: string) => {
        // forech from last solution to first
        context.state.solutions
            .slice()
            .reverse()
            .forEach(solution => {
                // close the solution
                context.commit(
                    solutionTypes.MutationTypes.closeSolution,
                    solution.meta.loadId,
                    defaultCommitOptions
                );
            });
        context.commit(
            settingsTypes.MutationTypes.hideMainNav,
            solutionloadId,
            defaultCommitOptions
        );
    },

    selectAsset: (context, assetId: string) => {
        // debugger;
        const path = context.getters.assetFlow(assetId) as IResourceFlow;
        if (path.asset) {
            const p = path as IAssetFlow;
            context.commit(
                solutionTypes.MutationTypes.selectSolution,
                path,
                defaultCommitOptions
            );
            context.commit(
                solutionTypes.MutationTypes.selectProject,
                path,
                defaultCommitOptions
            );
            context.commit(
                solutionTypes.MutationTypes.selectReference,
                path,
                defaultCommitOptions
            );
            context.commit(
                solutionTypes.MutationTypes.selectAsset,
                path,
                defaultCommitOptions
            );
        }
    },

    deselectAsset: (context, assetId: string) => {
        // debugger;
        const path = context.getters.assetFlow(assetId) as IResourceFlow;
        if (path.asset) {
            const p = path as IAssetFlow;
            context.commit(
                solutionTypes.MutationTypes.deselectAsset,
                path,
                defaultCommitOptions
            );
        }
    },

    selectReference: (context, more: { refId: string; getters: any }) => {
        const path = more.getters.refPath(more.refId) as IResourceFlow;
        if (path.asset) {
            context.commit(
                solutionTypes.MutationTypes.selectReference,
                path as IResourceFlow,
                defaultCommitOptions
            );
        }
    },

    selectProject: (context, more: { projectId: string; getters: any }) => {
        const path = more.getters.refPath(more.projectId) as IResourceFlow;
        if (path.asset) {
            context.commit(
                solutionTypes.MutationTypes.selectProject,
                path as IProjectFlow,
                defaultCommitOptions
            );
        }
    },

    selectSolution: (context, more: { solutionId: string; getters: any }) => {
        const path = more.getters.refPath(more.solutionId) as IResourceFlow;
        if (path.asset) {
            context.commit(
                solutionTypes.MutationTypes.selectSolution,
                path as ISolutionFlow,
                defaultCommitOptions
            );
        }
    },
};

export default actions;
