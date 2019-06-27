const PREFIX = 'solution/';
export const ActionTypes = {
    /** params: filePath:string */
    loadSolutionFromFile: PREFIX + 'loadSolutionFromFile',
    openSolution: PREFIX + 'openSolution',
    closeSolution: PREFIX + 'closeSolution',
    closeAllSolutions: PREFIX + 'closeAllSolutions',
    selectAsset: PREFIX + 'selectAsset',
    deselectAsset: PREFIX + 'deselectAsset',
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
    selectAsset: PREFIX + 'selectAsset',
    deselectAsset: PREFIX + 'deselectAsset',
};

export const GetterTypes = {
    currentSolution: PREFIX + 'currentSolution',
    currentAsset: PREFIX + 'currentAsset',
    currentProject: PREFIX + 'currentProject',
    assetFlow: PREFIX + 'assetFlow',
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
