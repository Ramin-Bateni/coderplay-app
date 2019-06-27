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
import { GetterTree } from 'vuex';
import { IRootState } from '../types';
import solutionState from './state';
import * as types from './types';
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');

const getters: GetterTree<typeof solutionState, IRootState> = {
    currentSolution: state => {
        // debugger;
        return state.solutions.length <= 0
            ? undefined
            : state.solutions.filter(
                  (solution: ILoadedSolution) => solution.meta.isSelected
              )[0];
    },
    currentProject(state, get: any) {
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
    currentReference(state, get: any) {
        // debugger;
        const obj = get.currentProject;
        if (obj) {
            return ((obj as unknown) as IProject).references.find(
                i => i.isSelected
            );
        }
        return undefined;
    },
    currentAsset(state, get: any) {
        // debugger;
        const obj = get.currentReference;
        if (obj) {
            return ((obj as unknown) as IReference).assets.find(
                i => i.isSelected
            );
        }
        return undefined;
    },
    // We should path the assetId to this getter
    assetFlow: state => (assetId: string): IResourceFlow => {
        const path: IResourceFlow = {
            solution: undefined,
            project: undefined,
            reference: undefined,
            asset: undefined,
        };
        const result4 = state.solutions.find((solution: ILoadedSolution) => {
            const result3 = solution.projects.find(project => {
                const result2 = project.references.find(ref => {
                    const result1 = ref.assets.find(asset => {
                        return asset.id === assetId;
                    });
                    if (result1) {
                        path.asset = result1 as IAsset;
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
            asset: undefined,
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
            asset: undefined,
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
            asset: undefined,
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
