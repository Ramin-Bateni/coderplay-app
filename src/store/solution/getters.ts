import {
    IAssetItem,
    ILoadedSolution,
    IProject,
    IReference,
    IResourceFlow,
} from '@/components/CoderplaySolutionTypes';
import { GetterTree } from 'vuex';
import { IRootState } from '../types';
import solutionState from './state';

const getters: GetterTree<typeof solutionState, IRootState> = {
    currentSolution: state => {
        // debugger;
        return state.solutions.length <= 0
            ? undefined
            : state.solutions.filter(
                  (solution: ILoadedSolution) => solution.meta.isSelected
              )[0];
    },
    currentProject(state: any, get: any) {
        //        debugger;
        const obj = get.currentSolution;
        if (!obj) {
            return undefined;
        }
        return ((obj as unknown) as ILoadedSolution).projects.find(
            i => i.isSelected
        );
        // debugger
        // const obj=state.solutions.solutions.length <= 0
        // ? undefined
        // : state.solutions.solutions.filter( (i) => i.meta.isSelected)[0];
        // if(obj){
        //    return (obj as ILoadedSolution)
        //           .projects.find(i=>i.isSelected);
        // }
        // return undefined;
    },
    currentReference(state: any, get: any) {
        // console.log('in currentReference', state);
        // console.log('in currentReference', get);
        //debugger;
        const obj = get.currentProject;
        if (obj) {
            return ((obj as unknown) as IProject).references.find(
                i => i.isSelected
            );
        }
        return undefined;
    },
    currentAssetItem(state: any, get: any) {
        // debugger;
        const obj = get.currentReference;
        if (obj) {
            return ((obj as unknown) as IReference).assetItems.find(
                i => i.isSelected
            );
        }
        return undefined;
    },
    // We should path the assetId to this getter
    assetItemFlow: state => (assetId: string): IResourceFlow => {
        const path: IResourceFlow = {
            solution: undefined,
            project: undefined,
            reference: undefined,
            assetItem: undefined,
        };
        const result4 = state.solutions.find((solution: ILoadedSolution) => {
            const result3 = solution.projects.find(project => {
                const result2 = project.references.find(ref => {
                    const result1 = ref.assetItems.find(assetItem => {
                        return assetItem.id === assetId;
                    });
                    if (result1) {
                        path.assetItem = result1 as IAssetItem;
                        return true;
                    }
                    return false;
                });
                if (result2) {
                    path.reference = result2 as IReference;
                    return true;
                }
                return false;
            });
            if (result3) {
                path.project = result3 as IProject;
                return true;
            }
            return false;
        });
        if (result4) {
            path.solution = result4 as ILoadedSolution;
        }

        return path;
    },
    referenceFlow: state => (refId: string): IResourceFlow => {
        const path: IResourceFlow = {
            solution: undefined,
            project: undefined,
            reference: undefined,
            assetItem: undefined,
        };
        const result4 = state.solutions.find((solution: ILoadedSolution) => {
            const result3 = solution.projects.find(project => {
                const result2 = project.references.find(ref => {
                    return ref.id === refId;
                });
                if (result2) {
                    path.reference = result2 as IReference;
                    return true;
                }
                return false;
            });
            if (result3) {
                path.project = result3 as IProject;
                return true;
            }
            return false;
        });
        if (result4) {
            path.solution = result4 as ILoadedSolution;
        }

        return path;
    },
    projectFlow: state => (projectId: string): IResourceFlow => {
        const path: IResourceFlow = {
            solution: undefined,
            project: undefined,
            reference: undefined,
            assetItem: undefined,
        };
        const result4 = state.solutions.find((solution: ILoadedSolution) => {
            const result3 = solution.projects.find(project => {
                return project.id === projectId;
            });
            if (result3) {
                path.project = result3 as IProject;
                return true;
            }
            return false;
        });

        if (result4) {
            path.solution = result4 as ILoadedSolution;
        }
        return path;
    },
    solutionFlow: state => (solutionLoadId: string): IResourceFlow => {
        const path: IResourceFlow = {
            solution: undefined,
            project: undefined,
            reference: undefined,
            assetItem: undefined,
        };
        const result4 = state.solutions.find((solution: ILoadedSolution) => {
            return solution.meta.loadId === solutionLoadId;
        });
        if (result4) {
            path.solution = result4 as ILoadedSolution;
        }
        return path;
    },
    isAnyOpenSolution: (state): boolean => {
        return state.solutions.length > 0;
    },
    allSolutions: (state): ILoadedSolution[] => {
        return state.solutions;
    },
};

export default getters;
