const PREFIX = 'setting/';
export const ActionTypes = {
    /** params: isDark:boolean */
    switchTheme: PREFIX + 'switchTheme',
    saveSettings: PREFIX + 'saveSettings',
};

export const MutationTypes = {
    showMainNavPermanent: PREFIX + 'showMainNavPermanent',
    showMainNavTemporary: PREFIX + 'showMainNavTemporary',
    setMainNavVisilbility: PREFIX + 'setMainNavVisilbility',
    hideMainNav: PREFIX + 'hideMainNav',
    toggleMainNav: PREFIX + 'toggleMainNav',
    setMainNav: PREFIX + 'setMainNav',

    //
    /** params: isDark:boolean */
    switchTheme: PREFIX + 'switchTheme',

    /** params: settings:ISettings */
    setSettings: PREFIX + 'setSettings',
    openSettings: PREFIX + 'openSettings',
    closeSettings: PREFIX + 'closeSettings',
};

export const GetterTypes = {
    currentSolution: PREFIX + 'currentSolution',
    isAnyOpenSolution: PREFIX + 'isAnyOpenSolution',
};
