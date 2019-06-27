import {
    ILoadedSolution,
    IPrimaryDrawer,
    ISettings,
} from '@/components/CoderplaySolutionTypes';
import * as authState from './auth/state';
import * as settingState from './setting/state';
import * as solutionsState from './solution/state';

import * as authTypes from './auth/types';
import * as settingsTypes from './setting/types';
import * as solutionTypes from './solution/types';

export interface IRootState {
    settings: typeof settingState;
    auth: typeof authState;
    solutions: typeof solutionsState;
}

const Types = {
    namespaces: {
        settings: 'settings',
        solution: 'solution',
        auth: 'auth',
    } as {
        settings: string;
        solution: string;
        auth: string;
    },
    settings: settingsTypes,
    solution: solutionTypes,
    auth: authTypes,
};

export default Types;

export { settingsTypes, solutionTypes, authTypes };
