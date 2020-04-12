import {
    IAssetFlow,
    IAssetItem,
    ILoadedSolution,
    IProject,
    IReference,
    ISolution,
} from '@/components/CoderplaySolutionTypes';
import fs from 'fs';
import { MutationTree } from 'vuex';
import SolutionState from './state';

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
            fs.writeFile(solution.meta.filePath, solution as ISolution, () => {
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

    deselectAssetItemByPath: (state, path) => {
        // console.log('mutation > deselectAssetItem', state);
        // console.log('mutation > deselectAssetItem', path);
        const asset = findAssetItem(state, path);
        asset.isSelected = false;
    },
    deselectAssetItem: (state, assetItem) => {
        if (assetItem) {
            assetItem.isSelected = false;
        }
    },

    deselectProject: (state, proj) => {
        if (proj) {
            proj.isSelected = false;
        }
    },

    deselectReference: (state, ref) => {
        if (ref) {
            ref.isSelected = false;
        }
    },

    selectAssetItem: (state, path) => {
        // console.log('mutation > selectAssetItem', state);
        // console.log('mutation > selectAssetItem', path);
        const assetItem = findAssetItem(state, path);
        assetItem.isSelected = true;
        // console.log(state);
    },

    selectReference: (state, path) => {
        const ref = ((state.solutions.find(
            (i: ILoadedSolution) => i.meta.loadId === path.solution.meta.loadId
        ) as ILoadedSolution).projects.find(
            i => i.id === path.project.id
        ) as IProject).references.find(
            i => i.id === path.reference.id
        ) as IReference;
        // console.log('mutation > selectReference', path);
        // console.log(ref);
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

function findAssetItem(
    state: typeof SolutionState,
    path: IAssetFlow
): IAssetItem {
    // console.log('mutation > selectAssetItem', state);
    // console.log('mutation > selectAssetItem', path);
    // debugger;
    const assetItem = (((state.solutions.find(
        (i: ILoadedSolution) => i.meta.loadId === path.solution.meta.loadId
    ) as ILoadedSolution).projects.find(
        i => i.id === path.project.id
    ) as IProject).references.find(
        i => i.id === path.reference.id
    ) as IReference).assetItems.find(
        i => i.id === path.assetItem.id
    ) as IAssetItem;

    return assetItem;
}

export default mutations;
