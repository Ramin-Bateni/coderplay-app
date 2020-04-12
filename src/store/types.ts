import {
    ILoadedSolution,
    IPrimaryDrawer,
    ISettings,
} from '@/components/CoderplaySolutionTypes';
import * as aboutState from './about/state';
import * as authState from './auth/state';
import * as settingState from './setting/state';
import * as solutionsState from './solution/state';

import * as aboutTypes from './about/types';
import * as authTypes from './auth/types';
import * as settingsTypes from './setting/types';
import * as solutionTypes from './solution/types';

export interface IRootState {
    settings: typeof settingState;
    auth: typeof authState;
    solutions: typeof solutionsState;
    about: typeof aboutState;
}

const Types = {
    namespaces: {
        settings: 'settings',
        solution: 'solution',
        auth: 'auth',
        about: 'about',
    } as {
        settings: string;
        solution: string;
        auth: string;
        about: string;
    },
    settings: settingsTypes,
    solution: solutionTypes,
    auth: authTypes,
    about: aboutTypes,
};

export default Types;

export { settingsTypes, solutionTypes, authTypes, aboutTypes };
