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
import Vue from 'vue';
import Vuex from 'vuex';
import {
    appConfigStore,
    Defaults,
    IAppConf,
    ReadyAppConfig,
} from '../appConfig';
import t from './types';
const uuidV4 = require('uuid/v4');

Vue.use(Vuex);

const store = new Vuex.Store({
    // the strict:true force to preventing any state changes without mutaions
    //      but strict be true >>
    //      if bind a property of state such as mainNav.clipped to a ui element
    //      and it changed the mainNav.clipped then it cause and error
    strict: false,
    // =======================================================================================================
    state: {
        // settings ------------
        settings: {
            dialog: {
                visibility: false,
            },
            model: {
                ui: {
                    isDarkTheme: true,
                },
            } as ISettings,
        },
        // UI ------------------
        ui: {
            mainNav: {
                model: false,
                type: '',
                clipped: false,
                floating: false,
                mini: false,
            } as IPrimaryDrawer,
        },
        // Solution ------------
        solutions: {
            solutions: [] as ILoadedSolution[],
        },
    },
    // =======================================================================================================
    mutations: {
        setMainNav: (state, mainNav) => {
            state.ui.mainNav.type = mainNav;
        },
        toggleMainNav: state => {
            state.ui.mainNav.type =
                state.ui.mainNav.type !== '' ? '' : 'permanent';
        },
        hideMainNav: state => {
            state.ui.mainNav.type = '';
        },
        showMainNavPermanent: state => {
            state.ui.mainNav.type = 'permanent';
        },
        showMainNavTemporary: (state, type) => {
            state.ui.mainNav.type = 'temporary';
        },
        setMainNavVisilbility: (state, type) => {
            state.ui.mainNav.type = type;
        },
        switchTheme: (state, payload) => {
            appConfigStore.set('darkTheme', payload);
            state.settings.model.ui.isDarkTheme = payload;
        },
        setSettings: (state, settingsModel: ISettings) => {
            state.settings.model = settingsModel;
        },
        openSettings: state => {
            state.settings.dialog.visibility = true;
        },
        closeSettings: state => {
            state.settings.dialog.visibility = false;
        },
        openSolution: (state, loadedSolution: ILoadedSolution) => {
            // find Index of solution by its filePath
            const solutionIndex = state.solutions.solutions.findIndex(i => {
                return i.meta.filePath === loadedSolution.meta.filePath;
            });
            // if the solution is loaded before
            // mark it is as the selected solution and mark others as not-selected
            if (solutionIndex > -1) {
                state.solutions.solutions.forEach(i => {
                    i.meta.isSelected = false;
                });
                state.solutions.solutions[solutionIndex].meta.isSelected = true;
            } else {
                state.solutions.solutions.push(loadedSolution);
            }
        },
        closeSolution: (state, solutionloadId: string) => {
            // find Index of solution by its loadId
            const solutionIndex = state.solutions.solutions.findIndex(i => {
                return i.meta.loadId === solutionloadId;
            });
            const solution = state.solutions.solutions[solutionIndex];

            // if the solution is modified then we save the changes to its file
            // before remove it from the solution list
            if (solution.meta.isModified) {
                fs.writeFile(
                    solution.meta.filePath,
                    solution as ISolution,
                    err => {
                        alert('Error is saving the solution!');
                    }
                );
            }
            // if the remove-solution is the selected then
            // we mark the first solution in the list as selected
            if (
                solution.meta.isSelected &&
                state.solutions.solutions.length > 0
            ) {
                state.solutions.solutions[0].meta.isSelected = true;
            }
            // remove
            state.solutions.solutions.splice(solutionIndex, 1);
        },

        selectAsset: (state, path) => {
            const asset = (((state.solutions.solutions.find(
                i => i.meta.loadId === path.solution.meta.loadId
            ) as ILoadedSolution).projects.find(
                i => i.id === path.project.id
            ) as IProject).references.find(
                i => i.id === path.reference.id
            ) as IReference).assets.find(i => i.id === path.asset.id) as IAsset;

            asset.isSelected = true;
        },
        selectReference: (state, path) => {
            const ref = ((state.solutions.solutions.find(
                i => i.meta.loadId === path.solution.meta.loadId
            ) as ILoadedSolution).projects.find(
                i => i.id === path.project.id
            ) as IProject).references.find(
                i => i.id === path.reference.id
            ) as IReference;

            ref.isSelected = true;
        },

        selectProject: (state, path) => {
            const project = (state.solutions.solutions.find(
                i => i.meta.loadId === path.solution.meta.loadId
            ) as ILoadedSolution).projects.find(
                i => i.id === path.project.id
            ) as IProject;

            project.isSelected = true;
        },

        selectSolution: (state, path) => {
            const solution = state.solutions.solutions.find(
                i => i.meta.loadId === path.solution.meta.loadId
            ) as ILoadedSolution;
            solution.meta.isSelected = true;
        },
    },
    // =======================================================================================================
    actions: {
        saveSettings: (context, settingsModel: ISettings) => {
            // TODO: should save settings then commit the new states to be changed by the relative mutation
            // TODO: must be changed to save all settings

            debugger;
            appConfigStore.set('darkTheme', settingsModel.ui.isDarkTheme);
            context.commit(t.settings.MutationTypes.setSettings, settingsModel);
        },
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

            context.commit(t.solution.MutationTypes.openSolution, solution);
            context.commit(t.settings.MutationTypes.showMainNavPermanent);
        },
        openSolution: (context, loadedSolution) => {
            context.commit(
                t.solution.MutationTypes.openSolution,
                loadedSolution
            );
            context.commit(t.settings.MutationTypes.showMainNavPermanent);
        },
        closeSolution: (context, solutionloadId) => {
            context.commit(
                t.solution.MutationTypes.closeSolution,
                solutionloadId
            );
            context.commit(
                t.settings.MutationTypes.hideMainNav,
                solutionloadId
            );
        },
        closeAllSolutions: (context, solutionloadId) => {
            // forech from last solution to first
            context.state.solutions.solutions
                .slice()
                .reverse()
                .forEach(solution => {
                    // close the solution
                    context.commit(
                        t.solution.MutationTypes.closeSolution,
                        solution.meta.loadId
                    );
                });
            context.commit(
                t.settings.MutationTypes.hideMainNav,
                solutionloadId
            );
        },
        switchTheme: (context, isDark) => {
            context.commit(t.settings.MutationTypes.switchTheme, isDark);
        },
        selectAsset: (context, assetId) => {
            const path = context.getters.assetFlow(assetId) as IResourceFlow;
            if (path.asset) {
                const p = path as IAssetFlow;
                context.commit(t.solution.MutationTypes.selectSolution, path);
                context.commit(t.solution.MutationTypes.selectProject, path);
                context.commit(t.solution.MutationTypes.selectReference, path);
                context.commit(t.solution.MutationTypes.selectAsset, path);
            }
        },

        selectAsset: (context, { assetId, getters }) => {
            const path = getters.assetFlow(assetId) as IResourceFlow;
            if (path.asset) {
                context.commit(
                    t.solution.MutationTypes.selectAsset,
                    path as IAssetFlow
                );
            }
        },
        selectReference: (context, { refId, getters }) => {
            const path = getters.refPath(refId) as IResourceFlow;
            if (path.asset) {
                context.commit(
                    t.solution.MutationTypes.selectReference,
                    path as IResourceFlow
                );
            }
        },

        selectProject: (context, { projectId, getters }) => {
            const path = getters.refPath(projectId) as IResourceFlow;
            if (path.asset) {
                context.commit(
                    t.solution.MutationTypes.selectProject,
                    path as IProjectFlow
                );
            }
        },

        selectSolution: (context, { solutionId, getters }) => {
            const path = getters.refPath(solutionId) as IResourceFlow;
            if (path.asset) {
                context.commit(
                    t.solution.MutationTypes.selectSolution,
                    path as ISolutionFlow
                );
            }
        },
    },
    // =======================================================================================================
    getters: {
        currentSolution: state => {
            return state.solutions.solutions.length <= 0
                ? undefined
                : state.solutions.solutions.filter(i => i.meta.isSelected)[0];
        },
        currentProject: (state, getters) => {
            const obj = getters.currentSolution;
            if (!obj) {
                return undefined;
            }
            return obj.projects.find((i: IProject) => i.isSelected);
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
        currentReference: (state, getters) => {
            const obj = getters.currentProject;
            if (obj) {
                return (obj as IProject).references.find(i => i.isSelected);
            }
            return undefined;
        },
        currentAsset: (state, getters) => {
            const obj = getters.currentReference;
            if (obj) {
                return (obj as IReference).assets.find(i => i.isSelected);
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
            const result4 = state.solutions.solutions.find(solution => {
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
            const result4 = state.solutions.solutions.find(solution => {
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
            const result4 = state.solutions.solutions.find(solution => {
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
            const result4 = state.solutions.solutions.find(solution => {
                return solution.meta.loadId === solutionLoadId;
            });
            if (result4) {
                path.solution = result4 as ILoadedSolution;
            }
            return path;
        },
        isAnyOpenSolution: (state): boolean => {
            return state.solutions.solutions.length > 0;
        },
        allSolution: (state): ILoadedSolution[] => {
            return state.solutions.solutions;
        },
        mainNav: (state): IPrimaryDrawer => {
            return state.ui.mainNav;
        },
    },
});

export default store;
