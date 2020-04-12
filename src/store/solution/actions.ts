import {
    IAsset,
    IAssetFile,
    ILoadedSolution,
    IProjectFlow,
    IResourceFlow,
    ISolutionFlow,
    ISolutionMeta,
} from '@/components/CoderplaySolutionTypes';
import fs from 'fs';
import { ActionContext, ActionTree } from 'vuex';
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

        solution.projects.forEach(proj =>
            proj.references.forEach(ref => {
                ref.assetItems.forEach(
                    assetItem =>
                        (assetItem.asset = (): IAsset => {
                            const result = proj.assets.find(
                                i => i.id === assetItem.id
                            );
                            return result || defaultAsset(assetItem.id);
                        })
                );
            })
        );

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

    selectAssetItem: (context, assetId: string) => {
        // debugger;
        const path = context.getters.assetItemFlow(assetId) as IResourceFlow;
        if (path.assetItem) {
            // const p = path as IAssetFlow;
            // first deselect th currentAsset
            context.dispatch(
                solutionTypes.ActionTypes.deselectAssetItem,
                path.assetItem.id,
                defaultCommitOptions
            );

            // Now select the Asset Item and its related reference and project
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
                solutionTypes.MutationTypes.selectAssetItem,
                path,
                defaultCommitOptions
            );
        }
    },

    deselectAssetItem: (context, assetId: string) => {
        // debugger;
        const path = context.getters.assetItemFlow(assetId) as IResourceFlow;
        if (path.assetItem) {
            const curAsset = context.getters.currentAssetItem;

            if (curAsset) {
                context.commit(
                    solutionTypes.MutationTypes.deselectAssetItem,
                    curAsset,
                    defaultCommitOptions
                );
            }
        }
    },

    deselectAssetItemFlow: (context, assetId: string) => {
        // debugger;
        const path = context.getters.assetItemFlow(assetId) as IResourceFlow;
        if (path.assetItem) {
            const curRef = context.getters.currentReference;
            const curProj = context.getters.currentProject;
            const curAssetItem = context.getters.currentAssetItem;
            console.log('deselectAssetItem', {
                curProj,
                curRef,
                curAsset: curAssetItem,
            });

            if (curProj) {
                context.commit(
                    solutionTypes.MutationTypes.deselectProject,
                    curProj,
                    defaultCommitOptions
                );
            }
            if (curRef) {
                context.commit(
                    solutionTypes.MutationTypes.deselectReference,
                    curRef,
                    defaultCommitOptions
                );
            }

            if (curAssetItem) {
                context.commit(
                    solutionTypes.MutationTypes.deselectAssetItem,
                    curAssetItem,
                    defaultCommitOptions
                );
            }
        }
    },

    selectReference: (context, refId: string) => {
        const path = context.getters.referenceFlow(refId) as IResourceFlow;
        if (path.reference) {
            const curRef = context.getters.currentReference;
            const curProj = context.getters.currentProject;
            const curAssetItem = context.getters.currentAssetItem;

            // console.log('action > selectReference', curRef);
            // console.log('action > selectReference', curProj);

            // debugger;

            if (curProj) {
                context.commit(
                    solutionTypes.MutationTypes.deselectProject,
                    curProj,
                    defaultCommitOptions
                );
            }

            if (curRef) {
                context.commit(
                    solutionTypes.MutationTypes.deselectReference,
                    curRef,
                    defaultCommitOptions
                );
            }

            if (curAssetItem) {
                context.commit(
                    solutionTypes.MutationTypes.deselectAssetItem,
                    curAssetItem,
                    defaultCommitOptions
                );
            }

            context.commit(
                solutionTypes.MutationTypes.selectProject,
                path as IResourceFlow,
                defaultCommitOptions
            );

            context.commit(
                solutionTypes.MutationTypes.selectReference,
                path as IResourceFlow,
                defaultCommitOptions
            );

            // if (curProj) {
            //     context.commit(
            //         solutionTypes.MutationTypes.deselectProject,
            //         curProj,
            //         defaultCommitOptions
            //     );
            //     context.commit(
            //         solutionTypes.MutationTypes.selectProject,
            //         path as IResourceFlow,
            //         defaultCommitOptions
            //     );
            // }

            // if (curRef) {
            //     context.commit(
            //         solutionTypes.MutationTypes.deselectReference,
            //         curRef,
            //         defaultCommitOptions
            //     );

            //     context.commit(
            //         solutionTypes.MutationTypes.selectReference,
            //         path as IResourceFlow,
            //         defaultCommitOptions
            //     );
            // }
        }
    },

    selectProject: (context, projectId: string) => {
        const path = context.getters.projectFlow(projectId) as IResourceFlow;
        if (path.project) {
            const curProj = context.getters.currentProject;

            if (!curProj) {
                return;
            }

            context.commit(
                solutionTypes.MutationTypes.deselectProject,
                curProj,
                defaultCommitOptions
            );

            context.commit(
                solutionTypes.MutationTypes.selectProject,
                path as IProjectFlow,
                defaultCommitOptions
            );
        }
    },

    selectSolution: (context, solutionId: string) => {
        const path = context.getters.solutionFlow(solutionId) as IResourceFlow;
        if (path.solution) {
            context.commit(
                solutionTypes.MutationTypes.selectSolution,
                path as ISolutionFlow,
                defaultCommitOptions
            );
        }
    },
};

function defaultAsset(assetId: string) {
    const def = {
        id: assetId,
        title: 'Asset Not Found!',
        desc: '',
        createdOn: new Date(),
        updatedOn: new Date(),
        file: {
            type: '',
            ext: '',
            textsOfMedia: [],
            subtitles: [],
        } as IAssetFile,
    } as IAsset;
    return def;
}

export default actions;
