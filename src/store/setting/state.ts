import { IPrimaryDrawer, ISettings } from '@/components/CoderplaySolutionTypes';

const state = {
    // settings: {
    dialog: {
        visibility: false,
    },
    model: {
        ui: {
            isDarkTheme: true,
            mainNav: {
                model: false,
                type: '',
                clipped: false,
                floating: false,
                mini: false,
            } as IPrimaryDrawer,
        },
    } as ISettings,
    // }
};

export default state;
