const PREFIX = 'solution/';
export const ActionTypes = {
    /** params: filePath:string */
    loadSolutionFromFile: PREFIX + 'loadSolutionFromFile',
    openSolution: PREFIX + 'openSolution',
    closeSolution: PREFIX + 'closeSolution',
    closeAllSolutions: PREFIX + 'closeAllSolutions',

    selectSolution: PREFIX + 'selectSolution',
    selectProject: PREFIX + 'selectProject',
    selectReference: PREFIX + 'selectReference',
    selectAssetItem: PREFIX + 'selectAssetItem',
    deselectAssetItem: PREFIX + 'deselectAssetItem',
    deselectAssetItemFlow: PREFIX + 'deselectAssetItemFlow',
    deselectProject: PREFIX + 'deselectProject',
    deselectReference: PREFIX + 'deselectReference',
};

export const MutationTypes = {
    /** params: filePath */
    loadSolutionFromFile: PREFIX + 'loadSolutionFromFile',
    openSolution: PREFIX + 'openSolution',
    closeSolution: PREFIX + 'closeSolution',
    closeAllSolutions: PREFIX + 'closeAllSolutions',

    selectSolution: PREFIX + 'selectSolution',
    selectProject: PREFIX + 'selectProject',
    selectReference: PREFIX + 'selectReference',
    selectAssetItem: PREFIX + 'selectAssetItem',
    deselectAssetItem: PREFIX + 'deselectAssetItem',
    deselectAssetItemByPath: PREFIX + 'deselectAssetItemByPath',
    deselectProject: PREFIX + 'deselectProject',
    deselectReference: PREFIX + 'deselectReference',
};

export const GetterTypes = {
    currentSolution: PREFIX + 'currentSolution',
    currentAssetItem: PREFIX + 'currentAssetItem',
    currentProject: PREFIX + 'currentProject',
    currentReference: PREFIX + 'currentReference',
    assetItemFlow: PREFIX + 'assetItemFlow',
    isAnyOpenSolution: PREFIX + 'isAnyOpenSolution',
    allSolutions: PREFIX + 'allSolutions',
};

export const GetterTypesPure = pureIt(GetterTypes);

function pureIt(obj: any) {
    const result = Object.assign({}, obj);
    for (const key in result) {
        if (result.hasOwnProperty(key)) {
            result[key] = (result[key] as string).substr(PREFIX.length);
        }
    }
    return result;
}
