import Store from 'electron-store';
import { Utility } from './utility';

// ----------------------------------------------------------------------
const schema: any = {
    version: {
        type: 'string',
    },
    darkTheme: {
        type: 'boolean',
    },
    window: {
        advanced: {
            position: {
                x: 'number',
                y: 'number',
            },
            size: {
                height: 'number',
                width: 'number',
            },
            state: 'string', // normal, maximized, minimized or fullscreen
        },
        minimal: {
            position: {
                x: 'number',
                y: 'number',
            },
        },
    },
    recentOpenedSolutions: {
        type: 'array',
        items: {
            solutionTitle: 'string',
            path: 'string',
        },
    },
};

interface IAppConfigStore {
    get: (configName: string) => any;

    set: {
        (configName: string, value: any): void;
        (value: any): void;
    };

    clear: () => void;
    store: object;
    path: string;
}

interface IAppConf {
    version: string;
    darkTheme: boolean;
    window: {
        advanced: {
            position: {
                x: number;
                y: number;
            };
            size: {
                height: number;
                width: number;
                minHeight: number;
                minWidth: number;
            };
            state: string; // normal, maximized, minimized or fullscreen
        };
        minimal: {
            position: {
                x: number;
                y: number;
            };
        };
    };
    recentOpenedSolutions: Array<{
        solutionTitle: string;
        path: string;
    }>;
}

const Defaults: IAppConf = {
    version: '1.0',
    darkTheme: true,
    window: {
        advanced: {
            position: {
                x: -1,
                y: -1,
            },
            size: {
                height: 750,
                width: 1200,
                minHeight: 600,
                minWidth: 1000,
            },
            state: 'normal',
        },
        minimal: {
            position: {
                x: -1,
                y: -1,
            },
        },
    },
    recentOpenedSolutions: [],
};

let filledByDefaults: boolean = false;

const appConfigStore: IAppConfigStore = new Store({ schema });

async function ReadyAppConfig(
    appVersion: string,
    forceDefaults: boolean
): Promise<any> {
    return Utility.fileIsExists(appConfigStore.path).then(
        (isExists: boolean) => {
            if ((!isExists && !filledByDefaults) || forceDefaults) {
                fillStoreByDefaults();
                filledByDefaults = true;
            } else {
                // the config file is exists
                // fillByDefaultValues();
            }
            return appConfigStore.store;
        }
    );
}

function fillStoreByDefaults(): void {
    if (filledByDefaults) {
        return;
    }
    console.log('fillByDefaultValues');

    try {
        appConfigStore.clear();
    } catch (error) {
        console.log(error);
    }

    appConfigStore.set(Defaults);
}

// appConfigStore.set("windows.minimal.position.top", 112);
// ----------------------------------------------------------------------

export { appConfigStore, ReadyAppConfig, IAppConf, Defaults };
