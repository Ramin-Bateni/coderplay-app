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
import { ActionContext, MutationTree } from 'vuex';
import { IRootState } from '../types';
import SolutionState from './state';
import * as types from './types';
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');

const mutations: MutationTree<typeof SolutionState> = {
    openSolution: (state, loadedSolution: ILoadedSolution) => {
        //   debugger;
        // find Index of solution by its filePath
        const solutionIndex = state.solutions.findIndex(i => {
            return i.meta.filePath === loadedSolution.meta.filePath;
        });
        // if the solution is loaded before
        // mark it is as the selected solution and mark others as not-selected
        if (solutionIndex > -1) {
            state.solutions.forEach((i: ILoadedSolution) => {
                i.meta.isSelected = false;
            });
            state.solutions[solutionIndex].meta.isSelected = true;
        } else {
            state.solutions.push(loadedSolution);
        }
    },
    closeSolution: (state, solutionloadId: string) => {
        // find Index of solution by its loadId
        const solutionIndex = state.solutions.findIndex(
            (i: ILoadedSolution) => {
                return i.meta.loadId === solutionloadId;
            }
        );
        const solution = state.solutions[solutionIndex];

        // if the solution is modified then we save the changes to its file
        // before remove it from the solution list
        if (solution.meta.isModified) {
            fs.writeFile(solution.meta.filePath, solution as ISolution, err => {
                alert('Error is saving the solution!');
            });
        }
        // if the remove-solution is the selected then
        // we mark the first solution in the list as selected
        if (solution.meta.isSelected && state.solutions.length > 0) {
            state.solutions[0].meta.isSelected = true;
        }
        // remove
        state.solutions.splice(solutionIndex, 1);
    },

    deselectAsset: (state, path) => {
        const asset = findAsset(state, path);
        asset.isSelected = false;
    },

    selectAsset: (state, path) => {
        const asset = findAsset(state, path);
        asset.isSelected = true;
    },
    selectReference: (state, path) => {
        const ref = ((state.solutions.find(
            (i: ILoadedSolution) => i.meta.loadId === path.solution.meta.loadId
        ) as ILoadedSolution).projects.find(
            i => i.id === path.project.id
        ) as IProject).references.find(
            i => i.id === path.reference.id
        ) as IReference;

        ref.isSelected = true;
    },

    selectProject: (state, path) => {
        const project = (state.solutions.find(
            (i: ILoadedSolution) => i.meta.loadId === path.solution.meta.loadId
        ) as ILoadedSolution).projects.find(
            i => i.id === path.project.id
        ) as IProject;

        project.isSelected = true;
    },

    selectSolution: (state, path) => {
        const solution = state.solutions.find(
            (i: ILoadedSolution) => i.meta.loadId === path.solution.meta.loadId
        ) as ILoadedSolution;
        solution.meta.isSelected = true;
    },
};

function findAsset(state: typeof SolutionState, path: IAssetFlow): IAsset {
    const asset = (((state.solutions.find(
        (i: ILoadedSolution) => i.meta.loadId === path.solution.meta.loadId
    ) as ILoadedSolution).projects.find(
        i => i.id === path.project.id
    ) as IProject).references.find(
        i => i.id === path.reference.id
    ) as IReference).assets.find(i => i.id === path.asset.id) as IAsset;

    return asset;
}

export default mutations;
